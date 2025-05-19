const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('./auth');

router.get('/followings', auth, async (req, res) => {
    const userId = req.user.user_id;

    try {
        const [followings] = await db.execute(`
            SELECT u.user_id, u.nickname, u.profile_img
            FROM followers f
            JOIN users u ON f.following_id = u.user_id
            WHERE f.follower_id = ?
        `, [userId]);

        if (followings.length === 0) {
            return res.status(404).json({ success: false, message: '팔로워가 없습니다.' });
        }

        return res.json({ success: true, followings });
    } catch (err) {
        console.error('팔로워 불러오기 실패:', err);
        return res.status(500).json({ success: false, message: '서버 오류' });
    }
});

router.post('/follow', auth, async (req, res) => {
    const { following_id } = req.body;
    const follower_id = req.user.user_id;

    if (!following_id) {
        return res.status(400).send({ message: 'following_id는 필수입니다.' });
    }

    try {
        const [checkResult] = await db.execute(
            `SELECT * FROM followers WHERE follower_id = ? AND following_id = ?`,
            [follower_id, following_id]
        );

        if (checkResult.length > 0) {
            return res.status(400).send({ message: '이미 팔로우한 사용자입니다.' });
        }

        const [insertResult] = await db.execute(
            `INSERT INTO followers (follower_id, following_id, created_at) VALUES (?, ?, NOW())`,
            [follower_id, following_id]
        );

        return res.status(200).send({ message: '팔로우 성공' });

    } catch (err) {
        console.error('팔로우 처리 중 오류:', err);
        return res.status(500).send({ message: '서버 오류' });
    }
});

router.delete('/unfollow', auth, async (req, res) => {
    const { following_id } = req.body;
    const follower_id = req.user.user_id;

    if (!following_id) {
        return res.status(400).send({ message: 'following_id는 필수입니다.' });
    }

    try {
        const [checkResult] = await db.execute(
            `SELECT * FROM followers WHERE follower_id = ? AND following_id = ?`,
            [follower_id, following_id]
        );

        if (checkResult.length === 0) {
            return res.status(400).send({ message: '팔로우 관계가 존재하지 않습니다.' });
        }

        const [deleteResult] = await db.execute(
            `DELETE FROM followers WHERE follower_id = ? AND following_id = ?`,
            [follower_id, following_id]
        );

        return res.status(200).send({ message: '언팔로우 성공' });

    } catch (err) {
        console.error('언팔로우 처리 중 오류:', err);
        return res.status(500).send({ message: '서버 오류' });
    }
});

router.get('/isFollowing', auth, async (req, res) => {
    const { following_id } = req.query;
    const follower_id = req.user.user_id;

    if (!following_id) {
        return res.status(400).send({ message: 'following_id는 필수입니다.' });
    }

    try {
        const [result] = await db.execute(
            `SELECT * FROM followers WHERE follower_id = ? AND following_id = ?`,
            [follower_id, following_id]
        );

        return res.status(200).send({ isFollowing: result.length > 0 });

    } catch (err) {
        console.error('팔로우 상태 확인 중 오류:', err);
        return res.status(500).send({ message: '서버 오류' });
    }
});

module.exports = router;