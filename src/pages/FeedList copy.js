import React, { useEffect, useState } from 'react';
import {
  Container, Card, CardHeader, CardContent, Button,
  Typography, Avatar, ImageList, ImageListItem
} from '@mui/material';
import FeedDetail from './FeedDetail';

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

function FeedList() {
    const [posts, setPosts] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const token = localStorage.getItem('token');
    const userPayload = token ? parseJwt(token) : null;
    const loginUserId = userPayload?.user_id;

    useEffect(() => {
        fetch('http://localhost:3005/feed/list')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setPosts(data.data);
            } else {
                console.error('불러오기 실패:', data.message);
            }
        })
        .catch(err => console.error('에러:', err));
    }, []);

    const handleDelete = (postId) => {
        const token = localStorage.getItem('token');
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
      
        fetch(`http://localhost:3005/feed/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('삭제 완료');
                setSelectedPostId(null);
                setPosts(posts.filter(post => post.post_id !== postId));
            } else {
                alert(data.message || '삭제 실패');
            }
        })
        .catch(err => console.error('삭제 요청 실패:', err));
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            {posts.map((post) => (
                <Card
                    key={post.post_id}
                    sx={{ mb: 4, cursor: 'pointer' }}
                    onClick={() => setSelectedPostId(post.post_id)}
                >
                    <CardHeader
                        avatar={
                            <Avatar src={`http://localhost:3005/${post.profile_img}`} />
                        }
                        title={post.nickname}
                        subheader={new Date(post.created_at).toLocaleString()}
                    />
                    <CardContent>
                        <Typography variant="body1" gutterBottom>
                            {post.content}
                        </Typography>
                        <ImageList cols={3} gap={8}>
                            {post.images.map((img, index) => (
                                <ImageListItem key={index}>
                                    <img
                                        src={`http://localhost:3005${img.image_url}`}
                                        alt={`img-${index}`}
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            ❤️ {post.like_count}명이 좋아합니다
                        </Typography>
                        {loginUserId === post.user_id && (
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleDelete(post.post_id);
                                }}
                                sx={{ mt: 2 }}
                            >
                            삭제
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ))}
            <FeedDetail
                postId={selectedPostId}
                open={Boolean(selectedPostId)}
                onClose={() => setSelectedPostId(null)}
            />
        </Container>
    );
}

export default FeedList;