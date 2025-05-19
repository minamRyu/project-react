const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const auth = require('./auth');

async function getUserByKey(userKey) {
    const [rows] = await db.execute(
        'SELECT nickname FROM users WHERE user_key = ?',
        [userKey]
    );
    return rows[0] || null;
}

async function replaceMentionsWithNicknames(content) {
    const mentionMatches = content.match(/@(\w+)/g);
    if (!mentionMatches) return content;

    let processedContent = content;

    for (const mention of mentionMatches) {
        const userKey = mention.substring(1);
        const user = await getUserByKey(userKey);
        if (user) {
            processedContent = processedContent.replace(mention, `@${user.nickname}`);
        }
    }

    return processedContent;
}

async function createMentionActivities(content, actorUserId, postId, commentId, parentCommentId) {
    const mentionMatches = content.match(/@(\w+)/g);
    if (!mentionMatches) return;

    for (const mention of mentionMatches) {
        const userKey = mention.substring(1);
        const [rows] = await db.execute('SELECT user_id FROM users WHERE user_key = ?', [userKey]);
        if (rows.length > 0) {
            const targetUserId = rows[0].user_id;
            await db.execute(`
                INSERT INTO activities (user_id, from_user_id, post_id, comment_id, parent_comment_id, type, created_at)
                VALUES (?, ?, ?, ?, ?, 'mention', NOW())
            `, [targetUserId, actorUserId, postId, commentId, parentCommentId]);
        }
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueName + ext);
    }
});

const upload = multer({ storage });

router.post('/add', auth, (req, res, next) => {
    upload.array('images')(req, res, function (err) {
        if (err) {
            return res.status(500).json({ success: false, message: '파일 업로드 실패', error: err });
        }
        next();
        });
    }, async (req, res) => {
        const { content } = req.body;
        const userId = req.user.user_id;
    try {
        const [postResult] = await db.execute(
            'INSERT INTO posts (user_id, content, created_at) VALUES (?, ?, NOW())',
            [userId, content]
        );
        const postId = postResult.insertId;
        const files = req.files;
        const sortOrders = req.body.sortOrders; 

        for (let i = 0; i < files.length; i++) {
            await db.execute(
                'INSERT INTO post_images (post_id, image_url, sort_order) VALUES (?, ?, ?)',
                [postId, `/uploads/${files[i].filename}`, Array.isArray(sortOrders) ? sortOrders[i] : 1]
            );
        }

        res.json({ success: true, postId });
    } catch (err) {
        console.error('게시물 등록 실패:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

router.get('/recommended-posts', async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = 10;  
    const offset = (page - 1) * limit;  

    try {
        const query = `
            SELECT 
                p.post_id, p.content, p.created_at,
                u.user_id, u.nickname, u.profile_img,
                (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.post_id) AS like_count,
                (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) AS comment_count
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            ORDER BY like_count DESC, comment_count DESC, p.created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `;
        const [posts] = await db.execute(query);

        const [images] = await db.execute(`
            SELECT post_id, image_url, sort_order
            FROM post_images
            ORDER BY post_id, sort_order ASC
        `);

        const postList = posts.map(post => {
            const postImages = images.filter(img => img.post_id === post.post_id);
            return {
                ...post,
                images: postImages
            };
        });

        res.json({ success: true, data: postList });
    } catch (err) {
        console.error('추천 피드 조회 실패:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

router.get('/detail/:postId', async (req, res) => {
    const postId = req.params.postId;
  
    try {
        const [[post]] = await db.execute(`
            SELECT 
                p.post_id, p.content, p.created_at,
                u.user_id, u.nickname, u.profile_img
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            WHERE p.post_id = ?
        `, [postId]);
    
        if (!post) {
            return res.status(404).json({ success: false, message: '게시글 없음' });
        }
    
        const [images] = await db.execute(`
            SELECT image_url, sort_order
            FROM post_images
            WHERE post_id = ?
            ORDER BY sort_order ASC
        `, [postId]);
    
        res.json({
            success: true,
            data: {
                ...post,
                images
            }
        });
    } catch (err) {
      console.error('❌ 게시글 상세 조회 실패:', err);
      res.status(500).json({ success: false, message: '서버 오류' });
    }
});

router.get('/comments/:postId', async (req, res) => {
    const postId = req.params.postId;
  
    try {
        const [comments] = await db.execute(`
            SELECT 
                c.comment_id, c.content, c.created_at, c.user_id,
                u.nickname, u.profile_img
            FROM comments c
            JOIN users u ON c.user_id = u.user_id
            WHERE c.post_id = ? AND c.parent_comment_id IS NULL
            ORDER BY c.created_at ASC
        `, [postId]);
    
        const [replies] = await db.execute(`
            SELECT 
                c.comment_id, c.content, c.created_at, c.parent_comment_id,
                c.user_id, u.nickname, u.profile_img
            FROM comments c
            JOIN users u ON c.user_id = u.user_id
            WHERE c.post_id = ? AND c.parent_comment_id IS NOT NULL
            ORDER BY c.created_at ASC
        `, [postId]);
    
        const processedComments = await Promise.all(comments.map(async (comment) => ({
            ...comment,
            content: await replaceMentionsWithNicknames(comment.content),
            replies: await Promise.all(
                replies
                    .filter(r => r.parent_comment_id === comment.comment_id)
                    .map(async (reply) => ({
                        ...reply,
                        content: await replaceMentionsWithNicknames(reply.content)
                    }))
            )
        })));

        res.json({ success: true, data: processedComments });
    } catch (err) {
        console.error('❌ 댓글 및 대댓글 조회 실패:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});
  

router.post('/comments', auth, async (req, res) => {
    const { postId, content, parentCommentId  } = req.body;
    const userId = req.user.user_id;
  
    if (!postId || !content) {
        return res.status(400).json({ success: false, message: '필수 파라미터 누락' });
    }
  
    try {
        const [result] = await db.execute(`
            INSERT INTO comments (post_id, user_id, content, parent_comment_id, created_at)
            VALUES (?, ?, ?, ?, NOW())
        `, [postId, userId, content, parentCommentId || null]);

        const commentId = result.insertId;

        await createMentionActivities(content, userId, postId, commentId, parentCommentId || null);

        res.json({ success: true });
    } catch (err) {
        console.error('❌ 댓글 등록 실패:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

router.delete('/:postId', auth, async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.user_id;
  
    try {
        const [[post]] = await db.execute(`
            SELECT * FROM posts WHERE post_id = ? AND user_id = ?
        `, [postId, userId]);
    
        if (!post) {
            return res.status(403).json({ success: false, message: '삭제 권한 없음' });
        }

        await db.execute(`DELETE FROM activities WHERE post_id = ?`, [postId]);

        await db.execute(`DELETE FROM likes WHERE post_id = ?`, [postId]);

        await db.execute(`DELETE FROM comments WHERE post_id = ? AND parent_comment_id IS NOT NULL`, [postId]);

        await db.execute(`DELETE FROM comments WHERE post_id = ? AND parent_comment_id IS NULL`, [postId]);

        await db.execute(`DELETE FROM post_images WHERE post_id = ?`, [postId]);

        await db.execute(`DELETE FROM posts WHERE post_id = ?`, [postId]);
    
        res.json({ success: true });
    } catch (err) {
        console.error('❌ 게시물 삭제 실패:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

router.delete('/comments/:commentId', auth, async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.user.user_id;
  
    try {
        const [[comment]] = await db.execute(`
            SELECT * FROM comments WHERE comment_id = ? AND user_id = ?
        `, [commentId, userId]);
    
        if (!comment) {
            return res.status(403).json({ success: false, message: '삭제 권한 없음' });
        }
    
        await db.execute(`DELETE FROM comments WHERE comment_id = ?`, [commentId]);
    
        res.json({ success: true });
    } catch (err) {
        console.error('❌ 댓글 삭제 실패:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});
  
router.post('/like/:postId', auth, async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.user_id;
  
    try {
        const [existingLike] = await db.execute(`
            SELECT * FROM likes WHERE post_id = ? AND user_id = ?
        `, [postId, userId]);
    
        if (existingLike.length > 0) {
            await db.execute(`DELETE FROM likes WHERE post_id = ? AND user_id = ?`, [postId, userId]);
            return res.json({ success: true, liked: false });
        } else {
            await db.execute(`INSERT INTO likes (post_id, user_id, created_at) VALUES (?, ?, NOW())`, [postId, userId]);
            return res.json({ success: true, liked: true });
        }
    } catch (err) {
        console.error('❌ 좋아요 토글 실패:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});
  
router.get('/like/:postId', async (req, res) => {
    const postId = req.params.postId;
  
    try {
        const [countResult] = await db.execute(`
            SELECT COUNT(*) AS count FROM likes WHERE post_id = ?
        `, [postId]);
        const count = countResult[0].count;
    
        let liked = false;
    
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
    
        if (token) {
            const jwt = require('jsonwebtoken');
            const secretKey = process.env.JWT_SECRET;
    
            try {
                const user = jwt.verify(token, secretKey);
                const userId = user.user_id;
        
                const [likeResult] = await db.execute(`
                    SELECT * FROM likes WHERE post_id = ? AND user_id = ?
                `, [postId, userId]);
        
                liked = likeResult.length > 0;
            } catch (err) {
                liked = false;
            }
        }
    
        res.json({ success: true, count, liked });
    } catch (err) {
        console.error('❌ 좋아요 상태 조회 실패:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

router.get('/user', async (req, res) => {
    const userId = req.query.user_id;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'user_id는 필수입니다.' });
    }

    try {
        const query = `
            SELECT 
                p.post_id, p.content, p.created_at,
                u.user_id, u.nickname, u.profile_img,
                (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.post_id) AS like_count,
                (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) AS comment_count
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        `;
        const [posts] = await db.execute(query, [userId]);

        const [images] = await db.execute(`
            SELECT post_id, image_url, sort_order
            FROM post_images
            ORDER BY post_id, sort_order ASC
        `);

        const postsWithImages = posts.map(post => ({
            ...post,
            images: images.filter(img => img.post_id === post.post_id)
        }));

        res.json({ success: true, posts: postsWithImages  });
    } catch (err) {
        console.error('유저 피드 조회 실패:', err);
        res.status(500).json({ success: false, message: '서버 에러' });
    }
});

router.get('/my-feeds', auth, async (req, res) => {
    const userId = req.user.user_id;  

    try {
        const query = `
            SELECT 
                p.post_id, p.content, p.created_at,
                u.user_id, u.nickname, u.profile_img,
                (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.post_id) AS like_count,
                (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) AS comment_count
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        `;
        const [posts] = await db.execute(query, [userId]);

        const [images] = await db.execute(`
            SELECT post_id, image_url, sort_order
            FROM post_images
            ORDER BY post_id, sort_order ASC
        `);

        const postsWithImages = posts.map(post => ({
            ...post,
            images: images.filter(img => img.post_id === post.post_id)
        }));

        res.json({ success: true, posts: postsWithImages });
    } catch (err) {
        console.error('유저 피드 조회 실패:', err);
        res.status(500).json({ success: false, message: '서버 에러' });
    }
});
    
module.exports = router;