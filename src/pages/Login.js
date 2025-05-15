import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Stack, Link } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from "react-router-dom";
import CharacterAlert from './CharacterAlert';
import '../styles/character.css';

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
    const navigate = useNavigate();
    const [showCharacter, setShowCharacter] = useState(false);

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
                    setShowCharacter(true);
                    localStorage.setItem("token", data.token);
                } 
            })
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('서버 오류가 발생했습니다.');
        }
    };
    
    const handleClose = () => {
        setShowCharacter(false); 
        navigate("/feedList");
    };

    return (
        <Box sx={{ mt: 50, display: 'flex', justifyContent: 'center' }}>
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
                    {showCharacter && (
                        <CharacterAlert 
                            imageSrc="/assets/loginImg.png"  
                            onClose={handleClose}
                            imageStyle={{ maxWidth: '500px', marginTop: '20px' }} 
                        />
                    )}

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
        </Box>
    );
};

export default Login;