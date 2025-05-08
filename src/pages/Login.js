import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';

function Login() {
    const [form, setForm] = useState({
        email: '',
        pwd: ''
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async () => {
        const { email, pwd } = form;

        if (!email || !pwd) {
            alert('이메일과 비밀번호를 모두 입력하세요.');
            return;
        }
        try {
            fetch('http://localhost:3005/member/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, pwd }),
            })
            .then( res => res.json() )
            .then( data => {
                if(data.success){
                    setDialogMessage(data.message);
                    localStorage.setItem("token", data.token);
                    navigate("/myPage");
                } else {
                    setDialogMessage(data.message);
                }
                setDialogOpen(true);
            })
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('서버 오류가 발생했습니다.');
        }
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    return (
        <Container maxWidth="sm">
            <Box mt={10}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom align="center">
                        로그인
                        </Typography>

                        <Stack spacing={2} mt={2}>
                            <TextField
                                label="이메일"
                                variant="outlined"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="비밀번호"
                                type="password"
                                variant="outlined"
                                name="pwd"
                                value={form.pwd}
                                onChange={handleChange}
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleLogin}
                            >
                                로그인
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
            {/* 로그인 결과 다이얼로그 */}
            <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>알림</DialogTitle>
                <DialogContent>
                    <Typography>{dialogMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>확인</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Login;
