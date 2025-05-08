import React, { useState } from 'react';
import {
  Container,
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

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
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    
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
            setDialogMessage('회원가입이 완료되었습니다.');
            setDialogOpen(true);
        })
        .catch((err) => {
            setDialogMessage('회원가입 중 오류가 발생했습니다.');
            setDialogOpen(true);
        });
    };
        
    return (
        <Container maxWidth="sm">
        <Box mt={10}>
            <Card sx={{ p: 4 }}>
                <Typography variant="h5" textAlign="center" gutterBottom>
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
                    />
                    <TextField
                        label="비밀번호"
                        type="password"
                        name="pwd"
                        value={form.pwd}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="이름"
                        name="userName"
                        value={form.userName}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="전화번호"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="생년월일"
                        name="birth"
                        value={form.birth}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="소개"
                        name="intro"
                        value={form.intro}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleSubmit}
                        disabled={isDuplicate}
                    >
                    가입하기
                    </Button>
                </Stack>
            </Card>
        </Box>
    
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>알림</DialogTitle>
            <DialogContent>
                <Typography>{dialogMessage}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>확인</Button>
            </DialogActions>
        </Dialog>
        </Container>
    );
}

export default Join