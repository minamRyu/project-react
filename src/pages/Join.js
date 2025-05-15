import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Stack
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import CharacterAlert from './CharacterAlert';
import '../styles/character.css';

function Join() {
    const [form, setForm] = useState({
        email: '',
        pwd: '',
        userName: '',
        phone: '',
        birth: '',
        intro: '',
    });
    const [emailError, setEmailError] = useState('');
    const [isDuplicate, setIsDuplicate] = useState(false);
    const navigate = useNavigate();
    const [showCharacter, setShowCharacter] = useState(false);
    
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (e.target.name === 'email') {
            setEmailError('');
            setIsDuplicate(false);
        }
    };
    
    const clean = (v) => (v && v.trim() !== '') ? v : null;

    const checkEmailDuplicate = () => {
        const email = form.email.trim();
        if (!email) return;
    
        fetch('http://localhost:3005/member/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.isDuplicate) {
                setEmailError('이미 등록된 이메일입니다.');
                setIsDuplicate(true);
            } else {
                setEmailError('');
                setIsDuplicate(false);
            }
        })
        .catch((err) => {
            console.error('중복 확인 오류', err);
            setEmailError('이메일 확인 중 오류 발생');
            setIsDuplicate(true);
        });
    };

    const handleSubmit = () => {
        const { email, pwd, userName } = form;
        if (!email || !pwd || !userName) {
            alert('이메일, 비밀번호, 이름은 필수 입력입니다.');
            return;
        }
        const cleanedData = {
            email: form.email,
            pwd: form.pwd,
            userName: form.userName,
            phone: clean(form.phone),
            birth: clean(form.birth),
            intro: clean(form.intro),
        };


        fetch('http://localhost:3005/member/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cleanedData)
        })
        .then((res) => res.json())
        .then((data) => {
            setShowCharacter(true);       
        })
        .catch((err) => {
            alert('회원가입 중 오류가 발생했습니다.');
        });
    };

    const handleClose = () => {
        setShowCharacter(false); 
        navigate("/login");
    };
        
    return (
        <Box sx={{ mt: 50, display: 'flex', justifyContent: 'center' }}>
            <Box
                sx={{
                    backgroundColor: 'var(--color-current-line)',
                    border: '2px solid var(--color-purple)',
                    borderRadius: '8px',
                    width: '500px',
                    p: 3, // padding 24px
                }}
            >
                <Typography variant="h5" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', color: 'var(--color-green)' }}>
                회원가입
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="이메일"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={checkEmailDuplicate}
                        error={!!emailError}
                        helperText={emailError}
                        fullWidth
                        required
                        InputLabelProps={{ style: { color: 'var(--color-yellow)' } }}
                        InputProps={{ style: { color: 'var(--color-purple)' } }}
                    />
                    <TextField
                        label="비밀번호"
                        type="password"
                        name="pwd"
                        value={form.pwd}
                        onChange={handleChange}
                        fullWidth
                        required
                        InputLabelProps={{ style: { color: 'var(--color-yellow)' } }}
                        InputProps={{ style: { color: 'var(--color-purple)' } }}
                    />
                    <TextField
                        label="이름"
                        name="userName"
                        value={form.userName}
                        onChange={handleChange}
                        fullWidth
                        required
                        InputLabelProps={{ style: { color: 'var(--color-yellow)' } }}
                        InputProps={{ style: { color: 'var(--color-purple)' } }}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleSubmit}
                        disabled={isDuplicate}
                        sx={{
                            backgroundColor: 'var(--color-cyan)',
                            color: 'var(--color-background)',
                                    '&:hover': {
                                        backgroundColor: 'var(--color-yellow)',
                                        color: 'var(--color-background)',
                                    },
                        }}
                    >
                        가입하기
                    </Button>
                    {showCharacter && (
                        <CharacterAlert 
                            imageSrc="/assets/joinImg.png"  
                            onClose={handleClose}
                            imageStyle={{ maxWidth: '500px', marginTop: '20px' }} 
                        />
                    )}
                </Stack>
            </Box>
        </Box>
    );
}

export default Join