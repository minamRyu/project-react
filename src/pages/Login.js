import React, { useState } from 'react';
import { Container, Box, Card, CardContent, Typography, TextField, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Link } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from "react-router-dom";

const LoginCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '24px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
});

const StyledButton = styled(Button)({
  backgroundColor: '#0095F6', 
  '&:hover': {
    backgroundColor: '#0078D4',
  },
  padding: '10px 0',
  fontWeight: 'bold',
});

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
                    navigate("/feedList");
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
        <Box sx={{ mt: 35, display: 'flex', justifyContent: 'center' }}>
            <Box
                sx={{
                    backgroundColor: 'var(--color-current-line)',
                    color: 'var(--color-foreground)',
                    border: '2px solid var(--color-purple)',
                    borderRadius: '8px',
                    width: '500px',
                    p: 3, // padding 24px
                }}
            >
                <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'var(--color-green)' }}>
                로그인
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="이메일"
                        variant="outlined"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        fullWidth
                        sx={{ marginBottom: '16px' }}
                        InputLabelProps={{ style: { color: 'var(--color-yellow)' } }}
                        InputProps={{ style: { color: 'var(--color-green)' } }}
                    />
                    <TextField
                        label="비밀번호"
                        type="password"
                        variant="outlined"
                        name="pwd"
                        value={form.pwd}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ style: { color: 'var(--color-yellow)' } }}
                        InputProps={{ style: { color: 'var(--color-green)' } }}
                    />

                    <StyledButton
                        variant="contained"
                        onClick={handleLogin}
                        fullWidth
                        sx={{
                            backgroundColor: 'var(--color-cyan)',
                            color: 'var(--color-background)',
                                    '&:hover': {
                                        backgroundColor: 'var(--color-yellow)',
                                        color: 'var(--color-background)',
                                    },
                        }}
                    >
                        로그인
                    </StyledButton>

                    <Box sx={{ textAlign: 'center', marginTop: '16px', color: 'var(--color-purple)' }}>
                        <Typography variant="body2">
                        계정이 없으신가요?{' '}&nbsp;&nbsp;
                            <Link
                                href="/join"
                                underline="hover"
                                sx={{
                                    color: 'var(--color-orange)',
                                    fontWeight: 'bold',
                                    '&:hover': { color: 'var(--color-yellow)' },
                                }}
                            >
                                회원가입
                            </Link>
                        </Typography>
                    </Box>
                </Stack>
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
        </Box>
    );
};

export default Login;
