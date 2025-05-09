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
    const [followers, setFollowers] = useState([]);  
    const [page, setPage] = useState(1);  
    const [loading, setLoading] = useState(false); 
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [followingStatus, setFollowingStatus] = useState({});

    const token = localStorage.getItem('token');
    const userPayload = token ? parseJwt(token) : null;
    const loginUserId = userPayload?.user_id;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('토큰이 없습니다.');
            return;
        }
        fetch('http://localhost:3005/follow/followers', {
            headers: {
                'Authorization': `Bearer ${token}`  
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setFollowers(data.followers);  
            } else {
                console.error('팔로워 불러오기 실패:', data.message);
            }
        })
        .catch(err => console.error('팔로워 불러오기 오류:', err));
    }, [loginUserId]);

    // 팔로우 상태 확인
    const handleFollowCheck = (followingId) => {
        fetch(`http://localhost:3005/follow/isFollowing?following_id=${followingId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.isFollowing !== undefined) {
                setFollowingStatus(prev => ({
                    ...prev,
                    [followingId]: data.isFollowing
                }));
            }
        })
        .catch(err => console.error('팔로우 상태 확인 오류:', err));
    };

    // 팔로우 요청
    const handleFollow = (e, followingId) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) return;

        fetch('http://localhost:3005/follow/follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ following_id: followingId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('팔로우 성공');
                // 팔로우 후 상태 업데이트
                setFollowingStatus(prev => ({
                    ...prev,
                    [followingId]: true
                }));
            } else {
                alert('팔로우 실패: ' + data.message);
            }
        })
        .catch(err => console.error('팔로우 오류:', err));
    };

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('토큰이 없습니다.');
            return;
        }
        fetch(`http://localhost:3005/feed/recommended-posts?page=${page}`, {
            headers: {
                'Authorization': `Bearer ${token}`  
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    if (data.data.length > 0) {
                        setPosts(data.data);  
                    }
                    if (data.data.length < 10) {
                        setHasMorePosts(false); 
                    }
                } else {
                    console.error('추천 피드 불러오기 실패:', data.message);
                }
            })
            .catch(err => console.error('추천 피드 에러:', err))
            .finally(() => setLoading(false));
    }, [page]);

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

    const handleLoadMore = () => {
        if (hasMorePosts) {
            setPage(prevPage => prevPage + 1);
        } 
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <div style={{ display: 'flex', marginBottom: 16 }}>
                {followers.map(follower => (
                    <Avatar
                        key={follower.user_id}
                        src={`http://localhost:3005/${follower.profile_img}`}
                        alt={follower.nickname}
                        sx={{ marginRight: 1, cursor: 'pointer' }}
                        onClick={() => {
                            // 팔로워 클릭 시 해당 피드만 로딩하는 로직 추가 필요
                        }}
                    />
                ))}
            </div>

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
                        {loginUserId !== post.user_id && (
                            <Button
                                variant={followingStatus[post.user_id] ? 'outlined' : 'contained'}
                                color="primary"
                                size="small"
                                onClick={(e) => {
                                    if (followingStatus[post.user_id]) {
                                        alert('이미 팔로우 중입니다.');
                                    } else {
                                        handleFollow(e, post.user_id);
                                    }
                                }}
                                sx={{ mt: 2 }}
                            >
                                {followingStatus[post.user_id] ? '팔로우 중' : '팔로우'}
                            </Button>
                        )}
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

            {hasMorePosts && (
                <Button variant="contained" color="primary" onClick={handleLoadMore} sx={{ mt: 2 }}>
                    더보기
                </Button>
            )}

            <FeedDetail
                postId={selectedPostId}
                open={Boolean(selectedPostId)}
                onClose={() => setSelectedPostId(null)}
            />
        </Container>        
    );
}

export default FeedList;