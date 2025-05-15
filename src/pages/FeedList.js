import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, Button, Box,
  Typography, Avatar, ImageList, ImageListItem
} from '@mui/material';
import FeedDetail from './FeedDetail';
import { useParams , useNavigate } from 'react-router-dom';
import CharacterAlert from './CharacterAlert';
import '../styles/character.css';

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

function FeedList() {
    const [posts, setPosts] = useState([]);
    const [followers, setFollowers] = useState([]);  
    const [page, setPage] = useState(1);  
    const [loading, setLoading] = useState(false); 
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [followingStatus, setFollowingStatus] = useState({});
    const [selectedFollowerId, setSelectedFollowerId] = useState(null);
    const [openFeedDetail, setOpenFeedDetail] = useState(false);
    const { postId } = useParams();
    const navigate = useNavigate();
    const [activeFollowCharacterUserId, setActiveFollowCharacterUserId] = useState(null);
    const [pendingDeletePostId, setPendingDeletePostId] = useState(null);

    const token = localStorage.getItem('token');
    const userPayload = token ? parseJwt(token) : null;
    const loginUserId = userPayload?.user_id;    

    useEffect(() => {
        loadRecommendedPosts(page);
    }, [page]);

    useEffect(() => {
        posts.forEach(post => {
            handleFollowCheck(post.user_id);
        });
    }, [posts]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('토큰이 없습니다.');
            return;
        }
        fetch('http://localhost:3005/follow/followings', {
            headers: {
                'Authorization': `Bearer ${token}`  
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setFollowers(data.followings);  
            } else {
                console.error('팔로워 불러오기 실패:', data.message);
            }
        })
        .catch(err => console.error('팔로워 불러오기 오류:', err));
    }, [loginUserId]);

    const handleFollowCheck = (followingId) => {
        const token = localStorage.getItem('token');
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
            if (data.message === '팔로우 성공') {
                setActiveFollowCharacterUserId(followingId);
                handleFollowCheck(followingId); 
            } else {
                alert('팔로우 실패: ' + data.message);
            }
        })
        .catch(err => {
            console.error('팔로우 오류:', err);
            alert('팔로우 요청 중 오류 발생');
        });
    };

    const loadRecommendedPosts = (pageToLoad = 1) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('토큰이 없습니다.');
            return;
        }
        fetch(`http://localhost:3005/feed/recommended-posts?page=${pageToLoad}`, {
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
    };

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
                setPendingDeletePostId(postId); 
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

    const handleFollowerClick = (userId) => {
        setSelectedFollowerId(userId);
        fetch(`http://localhost:3005/feed/user?user_id=${userId}`)
            .then(res => res.json())
            .then(data => {
                setPosts(data.posts);  
            })
            .catch(err => console.error('피드 불러오기 실패:', err));
    };

    const handleShowAllPosts = () => {
        setSelectedFollowerId(null);  
        loadRecommendedPosts(1);  
        setPage(1); 
    };

    useEffect(() => {
        if (postId) {
            setOpenFeedDetail(true);  
        } else {
            setOpenFeedDetail(false); 
        }
    }, [postId]);

    const handlePostClick = (postId) => {
        if (pendingDeletePostId === postId) return;
            navigate(`/feedDetail/${postId}`);
    };

    return (
        <Box sx={{ mt: 18, display: 'flex', justifyContent: 'center' }}>
            <Box
                sx={{
                    width: '1000px',
                    backgroundColor: 'var(--color-current-line)',
                    color: 'var(--color-foreground)',
                    border: '2px solid var(--color-purple)',
                    borderRadius: '8px',
                    p: 3,
                }}
            >
                <Box sx={{ mb: 4 }}>
                    <Typography 
                        variant="h6"
                        sx={{color: 'var(--color-yellow)', fontWeight: 'bold'}}
                    >팔로워 목록</Typography>
                    <Box
                        sx={{
                            border: '1px solid var(--color-purple)',
                            borderRadius: '8px',
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            overflowX: 'auto',
                            color: 'var(--color-orange)', 
                            fontWeight: 'bold'
                        }}
                    >
                        {followers.map(follower => (
                            <Box key={follower.user_id} sx={{ mr: 2, textAlign: 'center' }}>
                                <Avatar
                                    src={`http://localhost:3005/${follower.profile_img}`}
                                    alt={follower.nickname}
                                    sx={{ width: 60, height: 60, cursor: 'pointer' }}
                                    onClick={() => handleFollowerClick(follower.user_id)}
                                />
                                <Typography sx={{ fontSize: 12, mt: 0.5 }}>
                                    {follower.nickname}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {selectedFollowerId && (
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Button variant="outlined" onClick={handleShowAllPosts}>
                                전체 추천 피드 보기
                            </Button>
                        </Box>
                    )}
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 10 }}>
                    <Typography 
                        variant="h6"
                        sx={{color: 'var(--color-red)', fontWeight: 'bold'}}
                    >추천 피드</Typography>
                    <Box sx={{ textAlign: 'right' }}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: 'var(--color-cyan)',
                                color: 'var(--color-background)',
                                '&:hover': {
                                    backgroundColor: 'var(--color-yellow)',
                                    color: 'var(--color-background)',
                                },
                            }}
                            onClick={() => navigate('/feedAdd')}
                        >
                            글쓰기
                        </Button>
                    </Box>
                </Box>
                
                {posts.map(post => (
                    <Card
                        key={post.post_id}
                        sx={{
                            mb: 4,
                            cursor: 'pointer',
                            backgroundColor: 'var(--color-background)',
                            color: 'var(--color-orange)',
                            border: '1px solid var(--color-purple)',
                        }}
                        onClick={() => handlePostClick(post.post_id)}
                    >
                        <CardHeader
                            avatar={<Avatar src={`http://localhost:3005/${post.profile_img}`} />}
                            title={post.nickname}
                            subheader={new Date(post.created_at).toLocaleString()}
                            subheaderTypographyProps={{ style: { color: 'var(--color-comment)' } }}
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
                            <Typography variant="body2" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                <img
                                    src={'/assets/pumpkin_on.png'}
                                    alt="Like"
                                    style={{ width: '30px', height: '30px', marginRight: '8px' }}
                                />
                                {post.like_count}명이 좋아합니다
                            </Typography>
                            {loginUserId !== post.user_id && (
                                <Button
                                    variant={followingStatus[post.user_id] ? 'outlined' : 'contained'}
                                    sx={{
                                        mt: 4,
                                        backgroundColor: 'var(--color-cyan)',
                                        color: 'var(--color-background)',
                                        '&:hover': {
                                            backgroundColor: 'var(--color-yellow)',
                                            color: 'var(--color-background)',
                                        },
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (followingStatus[post.user_id]) {
                                            alert('이미 팔로우 중입니다.');
                                        } else {
                                            handleFollow(e, post.user_id);
                                        }
                                    }}
                                >
                                {followingStatus[post.user_id] ? '팔로우 중' : '팔로우'}
                                </Button>
                            )}
                            {loginUserId === post.user_id && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    sx={{
                                        mt: 2,
                                        backgroundColor: 'var(--color-cyan)',
                                        color: 'var(--color-background)',
                                        '&:hover': {
                                            backgroundColor: 'var(--color-yellow)',
                                            color: 'var(--color-background)',
                                        },
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(post.post_id);
                                    }}
                                >
                                삭제
                                </Button>
                            )}
                            {activeFollowCharacterUserId === post.user_id && (
                                <CharacterAlert
                                    imageSrc="/assets/followImg.png"
                                    onClose={() => setActiveFollowCharacterUserId(null)}
                                />
                            )}
                            {pendingDeletePostId === post.post_id && (
                                <CharacterAlert
                                    imageSrc="/assets/delImg.png"
                                    imageStyle={{ maxWidth: '800px', marginTop: '20px' }} 
                                    onClose={() => {
                                        setPosts(posts.filter(p => p.post_id !== pendingDeletePostId));
                                        setPendingDeletePostId(null);
                                    }}
                                />
                            )}
                        </CardContent>
                    </Card>
                ))}

                {hasMorePosts && (
                    <Button
                        variant="contained"
                        sx={{
                            mt: 2,
                            backgroundColor: 'var(--color-green)',
                            color: 'var(--color-yellow)',
                            '&:hover': {
                                backgroundColor: 'var(--color-yellow)',
                                color: 'var(--color-background)',
                            },
                        }}
                        onClick={handleLoadMore}
                    >
                        더보기
                    </Button>
                )}
                <FeedDetail open={openFeedDetail} onClose={() => setOpenFeedDetail(false)} />
            </Box>
        </Box>
    );
}

export default FeedList;