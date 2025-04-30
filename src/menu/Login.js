import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Card,
    Typography,
    TextField,
    Button,
    Link,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';

function Login(){
    const [userId, setUserId] = useState('');
    const [pwd, setPassword] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!userId || !pwd) return alert("모든 항목을 입력해주세요.");
        fetch("http://localhost:3005/login", {
            method : "POST",
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify({userId, pwd})
        }) 
        .then( res => res.json() )
        .then( data => {
            // console.log(data);
            if(data.success){
                setDialogMessage(data.message);
                localStorage.setItem("token", data.token);
                navigate("/feedList");
            } else {
                setDialogMessage(data.message);
            }
            setDialogOpen(true);
        })
        
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    return (
        <Container maxWidth="sm">
        <Box mt={10}>
            <Card sx={{ p: 4 }}>
            <Typography variant="h5" textAlign="center" gutterBottom>
                로그인
            </Typography>

            <Box component="form" noValidate autoComplete="off">
                <Stack spacing={3}>
                <TextField
                    label="이메일"
                    type="text"
                    fullWidth
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <TextField
                    label="비밀번호"
                    type="password"
                    fullWidth
                    required
                    value={pwd}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleLogin}
                >
                    로그인
                </Button>
                </Stack>
            </Box>

            <Stack direction="row" justifyContent="space-between" mt={2}>
                <Link href="#" variant="body2">회원가입</Link>
                <Link href="#" variant="body2">비밀번호 찾기</Link>
            </Stack>
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
    )
}

export default Login