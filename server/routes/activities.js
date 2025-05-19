const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('./auth');

router.get('/mentions', auth, async (req, res) => {
    const userId = req.user.user_id;

    try {
        const [rows] = await db.execute(`
            SELECT a.*, u.nickname AS from_user_nickname, u.profile_img
            FROM activities a
            JOIN users u ON a.from_user_id = u.user_id
            WHERE a.user_id = ? AND a.type = 'mention'
            ORDER BY a.created_at DESC
            LIMIT 10
        `, [userId]);

        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('알림 조회 실패:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

module.exports = router;