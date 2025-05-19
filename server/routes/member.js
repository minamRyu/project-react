const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const { SECRET_KEY } = require('../config/jwtConfig');
const verifyToken = require('./auth');

async function generateUniqueUserKey(baseKey) {
    let candidate = baseKey;
    let counter = 1;

    while (true) {
        const [rows] = await db.execute('SELECT COUNT(*) AS count FROM users WHERE user_key = ?', [candidate]);
        if (rows[0].count === 0) {
            return candidate;
        }
        candidate = baseKey + counter;
        counter++;
    }
}

router.post('/join', async (req, res) => {
    const { email, pwd, userName, phone, birth, intro } = req.body;

    try {
        const hashPwd = await bcrypt.hash(pwd, 10);
        const baseUserKey = email.split('@')[0];
        const userKey = await generateUniqueUserKey(baseUserKey);

        const query = `
            INSERT INTO USERS (EMAIL, PWD, USERNAME, PHONE, BIRTH, USER_KEY, NICKNAME, INTRO, CDATE)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const [result] = await db.query(query, [
            email,
            hashPwd,
            userName,       
            phone,
            birth,
            userKey,       
            userName,       
            intro
        ]);

        res.json({ success: true, message: '회원가입이 완료되었습니다.', userKey });
    } catch (err) {
        console.error('회원가입 중 오류:', err);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
});

router.post('/check-email', async (req, res) => {
    const { email } = req.body;
    const userKeyCandidate = email.split('@')[0];

    try {
        const [rows] = await db.execute(`
            SELECT COUNT(*) AS count 
            FROM USERS 
            WHERE email = ? OR user_key = ?
        `, [email, userKeyCandidate]);

        const isDuplicate = rows[0].count > 0;
        res.json({ success: true, isDuplicate });
    } catch (error) {
        console.error('Email check error:', error);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

router.post('/login', async (req, res) => {
    const { email, pwd } = req.body;
    try{    
        let query = "SELECT * FROM users WHERE email = ?";    
        let [user] = await db.query(query, [email, pwd]);
        let result = {};
        if(user.length > 0){
            let isMatch = await bcrypt.compare(pwd, user[0].pwd);
            if(isMatch){  
                let payload = {
                    user_id: user[0].user_id,
                    email : user[0].email,
                    userName : user[0].userName,
                    phone : user[0].phone,
                    birth : user[0].birth,
                    profile_img : user[0].profile_img,
                    nickname : user[0].nickname,
                    intro : user[0].intro,
                    cdate : user[0].cdate
                };
                const token = jwt.sign(payload, SECRET_KEY, {expiresIn : '1h'});
                result = {
                    message : "로그인 성공",
                    success : true,
                    token : token
                }  
            } else {
                result = {
                    message : "비밀번호가 일치하지 않습니다.",
                    success : false
                }
            }
        } else {
            result = {
                message : "등록되지 않은 이메일입니다.",
                success: false
            }
        }
        res.json(result);
    } catch(err){
        console.log("DB 에러 발생");
        res.status(500).send("Server Error");
    }
});

router.get('/mypage', verifyToken, async (req, res) => {
    const email = req.user.email;
  
    try {
        const [rows] = await db.query(`
            SELECT email, userName, phone, birth, profile_img, nickname, intro, cdate
            FROM users WHERE email = ?
        `, [email]);
  
    if (rows.length === 0) {
        return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }
  
        res.json({ success: true, user: rows[0] });
    } catch (err) {
        console.error('마이페이지 조회 오류:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

router.post('/update', verifyToken, async (req, res) => {
    const { phone, birth, nickname, intro } = req.body;
    const userId = req.user.email; 
  
    try {
        const query = "UPDATE users SET "
                        + "phone = ?, " 
                        + "birth = ?, "
                        + "nickname = ?, "
                        + "intro = ? "
                        + "WHERE email = ? ";
        await db.query(query, [phone, birth, nickname, intro, userId]);
    
        res.json({ success: true, message: '수정 완료' });
    } catch (err) {
        console.error('정보 수정 오류:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });
  
router.post('/uploadProfile', verifyToken, upload.single('profile'), async (req, res) => {
    const email = req.user.email;
    const filename = req.file.filename; 
    const destination = req.file.destination; 
  
    try {
        let query = "UPDATE users SET profile_img = ? WHERE email = ?";
        let result = await db.query(query, [destination+filename, email]);
        res.json({
            success: true,
            fileName: filename,
            result : result
        });
    } catch (err) {
        console.error('프로필 이미지 업데이트 실패:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

router.get('/search', verifyToken, async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ success: false, message: '검색어가 없습니다.' });
    }

    try {
        const [rows] = await db.execute(`
            SELECT user_key, nickname
            FROM users
            WHERE user_id = ? OR nickname = ? 
            OR user_id LIKE ? OR nickname LIKE ?
            LIMIT 10
        `, [`%${query}%`, `%${query}%`]);

        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('회원 검색 실패:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

router.get('/recommendations', verifyToken, async (req, res) => {
    const userId = req.user.user_id;

    try {
        const [rows] = await db.execute(`
            SELECT u.user_key, u.nickname
            FROM followers f
            JOIN users u ON f.following_id = u.user_id
            WHERE f.follower_id = ?
            ORDER BY f.created_at DESC
            LIMIT 10
        `, [userId]);

        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('팔로워 추천 실패:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

router.get('/profile/:userId', (req, res) => {
    const { userId } = req.params; 

    const query = 'SELECT user_key, email, userName, birth, profile_img, nickname, intro FROM users WHERE userId = ?';

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error('DB 조회 오류:', err);
            return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
        }

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }

        const user = result[0];
        res.json({
            success: true,
            data: {
                user_key: user.user_key,
                email: user.email,
                userName: user.userName,
                birth: user.birth,
                profileImageUrl: user.profile_img,
                nickname: user.nickname,
                intro: user.intro
            }
        });
    });
});


module.exports = router;