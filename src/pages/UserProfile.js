import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { Container, Box, Typography, CircularProgress, Avatar, Card, CardContent, Grid, Button } from '@mui/material'; 

function UserProfile() {
    const { userId } = useParams(); 
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        setLoading(true); 
        setError(null); 

        fetch(`http://localhost:3005/member/profile/${userId}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                setUser(data.data); 
            } else {
                setError('사용자 정보를 불러오는 데 실패했습니다.'); 
            }
            setLoading(false); 
        })
        .catch((err) => {
            setError('서버와 연결하는 데 오류가 발생했습니다.'); 
            setLoading(false); 
        });
    }, [userId]); 

    if (loading) {
        return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
        </Box>
        );
    }

    if (error) {
        return (
        <Container>
            <Typography variant="h6" color="error" align="center">
            {error}
            </Typography>
        </Container>
        );
    }

    if (!user) {
        return (
        <Container>
            <Typography variant="h6" color="textSecondary" align="center">
            사용자 정보를 찾을 수 없습니다.
            </Typography>
        </Container>
        );
    }

    return (
        <Container>
        <Box sx={{ marginTop: 4 }}>
            <Card sx={{ display: 'flex', padding: 2 }}>
                <Avatar
                    alt={user.userName}
                    src={user.profileImageUrl}
                    sx={{ width: 120, height: 120, marginRight: 2 }}
                />
                <CardContent>
                    <Typography variant="h4" component="div" gutterBottom>
                        {user.nickname}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {user.intro}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">
                            이메일: {user.email}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="textSecondary">
                            생일: {new Date(user.birth).toLocaleDateString()}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
        </Container>
    );
}

export default UserProfile;
