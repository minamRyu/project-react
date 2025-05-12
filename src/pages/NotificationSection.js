import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Avatar } from '@mui/material';

const NotificationSection = ({ setSelectedPostId }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:3005/activities/mentions', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setNotifications(data.data);
                } else {
                    setError('멘션 알림을 불러오지 못했습니다.');
                }
            } catch (err) {
                setError('서버 오류');
            }
            setLoading(false);
        };

        fetchNotifications();
    }, []);

    if (loading) {
        return <Typography>로딩 중...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box>
        <Typography variant="h6" gutterBottom>
            멘션 알림
        </Typography>
        {notifications.length === 0 ? (
            <Typography>새로운 멘션 알림이 없습니다.</Typography>
        ) : (
            notifications.map((notification) => (
            <Card key={notification.activity_id} sx={{ mb: 2 }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={`http://localhost:3005/${notification.profile_img}`} />
                        <Box>
                            <Typography variant="body1">
                                <strong>{notification.from_user_nickname}</strong>님이 게시글에서 언급하셨습니다.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {new Date(notification.created_at).toLocaleString()}
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={() => setSelectedPostId(notification.post_id)}  
                    >
                        게시글 보기
                    </Button>
                </CardContent>
            </Card>
            ))
        )}
        </Box>
    );
};

export default NotificationSection;