import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Card, CardContent, Avatar,
  TextField, Button, CircularProgress, Alert, Stack,
  IconButton, Input 
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

function MyPage() {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const serverBase = 'http://localhost:3005';

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return '';
            return date.toISOString().substring(0, 10);
    };

    const handleImageChange = (e) => {
    const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleImageUpload = () => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('profile', selectedFile);

        fetch('http://localhost:3005/member/uploadProfile', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setMessage('프로필 이미지가 수정되었습니다.');
                setTimeout(() => setMessage(''), 3000);
                fetch(`${serverBase}/member/mypage`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setUser(data.user);
                        console.log(data.user.profile_img);
                        setSelectedFile(null);
                        setPreviewUrl(null);
                    }
                });
            }
        })
        .catch(() => setError('이미지 업로드 실패'));
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('로그인이 필요합니다.');
            setLoading(false);
            return;
        }

        fetch('http://localhost:3005/member/mypage', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setUser(data.user);
                setForm({
                    phone: data.user.phone || '',
                    birth: formatDate(data.user.birth),
                    nickname: data.user.nickname || '',
                    intro: data.user.intro || ''
                });  
            } else {
                setError(data.message);
            }
            setLoading(false);
        })
        .catch(() => {
            setError('서버 오류');
            setLoading(false);
        });
    }, []);

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:3005/member/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setMessage('정보가 수정되었습니다.');
                setTimeout(() => setMessage(''), 3000);
                return fetch('http://localhost:3005/member/mypage', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                setError(data.message || '수정 실패');
            }
        })
        .catch(() => setError('서버 오류'));
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                        key={user.profile_img}
                        src={
                          previewUrl ||
                          (user.profile_img
                            ? `${serverBase}/${user.profile_img}?t=${Date.now()}`
                            : '/default-profile.png')
                        }
                        sx={{ width: 80, height: 80, margin: '0 auto 16px auto' }}
                    />
                    <Stack direction="row" justifyContent="center" spacing={1}>
                        <Input type="file" accept="image/*" onChange={handleImageChange} />
                        <IconButton onClick={handleImageUpload} color="primary" component="span">
                            <PhotoCamera />
                        </IconButton>
                    </Stack>
                    <Avatar sx={{ width: 80, height: 80, margin: '0 auto 16px auto' }}>
                        {user.userName?.[0] || '?'}
                    </Avatar>
                    <Typography variant="h5" gutterBottom>{user.userName}</Typography>
                    <Typography variant="body2" gutterBottom>이메일: {user.email}</Typography>
                    <Stack spacing={2} mt={2}>
                        <TextField label="전화번호" name="phone" value={form.phone || ''} onChange={handleChange} fullWidth />
                        <TextField label="닉네임" name="nickname" value={form.nickname || ''} onChange={handleChange} fullWidth />
                        <TextField
                            label="생년월일"
                            name="birth"
                            type="date" 
                            value={formatDate(form.birth)}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            label="자기소개"
                            name="intro"
                            value={form.intro || ''}
                            onChange={handleChange}
                            multiline
                            minRows={3}
                            fullWidth
                        />
                        <Button variant="contained" onClick={handleSave}>수정하기</Button>
                        {message && <Alert severity="success">{message}</Alert>}
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}

export default MyPage;