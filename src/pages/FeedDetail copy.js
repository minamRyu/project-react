import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, TextField, Button, Stack,
    Typography, Avatar, ImageList, ImageListItem, Box, CircularProgress,
    Divider, IconButton 
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import { useParams, useNavigate } from 'react-router-dom';

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

function FeedDetail({ open, onClose }) {
    const { postId } = useParams(); 
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyTargetId, setReplyTargetId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [mentionQuery, setMentionQuery] = useState(''); 
    const [mentionSuggestions, setMentionSuggestions] = useState([]); 
    const [showMentionList, setShowMentionList] = useState(false); 
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const userPayload = token ? parseJwt(token) : null;
    const loginUserId = userPayload?.user_id;
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    // 게시글 상세보기
    useEffect(() => {
        if (!postId) return;
        setLoading(true);

        fetch(`http://localhost:3005/feed/detail/${postId}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setPost(data.data);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error('상세 보기 오류:', err);
            setLoading(false);
        });
    }, [postId]);

    useEffect(() => {
        if (!postId) return;
      
        fetch(`http://localhost:3005/feed/like/${postId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setLikeCount(data.count);
                setIsLiked(data.liked);
            }
        });
    }, [postId]);

    const handleLikeToggle = () => {
        fetch(`http://localhost:3005/feed/like/${postId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setIsLiked(data.liked);
                setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
            }
        });
    };

    // 댓글불러오기
    useEffect(() => {
        if (!postId) return;
        fetch(`http://localhost:3005/feed/comments/${postId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setComments(data.data);
                }
            })
            .catch(err => console.error('댓글 불러오기 실패:', err));
    }, [postId]);

    // 댓글 등록
    const handleCommentSubmit = () => {
        const token = localStorage.getItem('token');
        if (!token || !newComment.trim()) return;
    
        fetch('http://localhost:3005/feed/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                postId,
                content: newComment
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setNewComment('');
                return fetch(`http://localhost:3005/feed/comments/${postId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setComments(data.data);
                });
            }
        })
        .catch(err => console.error('댓글 등록 실패:', err));
    };

    const handleReplySubmit = (parentCommentId) => {
        const token = localStorage.getItem('token');
        if (!token || !replyText.trim()) return;
      
        fetch('http://localhost:3005/feed/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                postId,
                content: replyText,
                parentCommentId
            })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setReplyText('');
            setReplyTargetId(null);
            // 댓글 재조회
            return fetch(`http://localhost:3005/feed/comments/${postId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setComments(data.data);
                });
          }
        })
        .catch(err => console.error('대댓글 등록 실패:', err));
    };

    const handleCommentDelete = (commentId) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
      
        fetch(`http://localhost:3005/feed/comments/${commentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                fetch(`http://localhost:3005/feed/comments/${postId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setComments(data.data);
                });
            } else {
                alert(data.message || '댓글 삭제 실패');
            }
        })
        .catch(err => console.error('댓글 삭제 실패:', err));
    };

    // 댓글 입력 변화 처리
    const handleCommentChange = (e) => {
        const value = e.target.value;
        setNewComment(value);

        const mentionMatch = value.match(/@(\w*)$/);
        if (mentionMatch) {
            const query = mentionMatch[1];

            if (query === '') {
                // @만 입력한 경우 - 추천 목록
                fetch('http://localhost:3005/member/recommendations', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setMentionSuggestions(data.data);
                        setShowMentionList(true);
                    }
                });
            } else {
                // 검색어 입력한 경우 - 검색 목록
                fetch(`http://localhost:3005/member/search?query=${query}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setMentionSuggestions(data.data);
                        setShowMentionList(true);
                    }
                });
            }
        } else {
            setShowMentionList(false);
        }
    };

    const handleMentionSelect = (userKey) => {
        const newText = newComment.replace(/@(\w*)$/, `@${userKey} `);
        setNewComment(newText);
        setShowMentionList(false);
    };

    const handleClose = () => {
        navigate(-1);  
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>게시글 상세</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box textAlign="center" py={4}>
                        <CircularProgress />
                    </Box>
                ) : post ? (
                    <>
                        <Box display="flex" alignItems="center" mb={2}>
                            <Avatar
                                src={`http://localhost:3005/${post.profile_img}`}
                                alt={post.nickname}
                                sx={{ mr: 2 }}
                            />
                            <Box>
                                <Typography variant="subtitle1">{post.nickname}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(post.created_at).toLocaleString()}
                                </Typography>
                            </Box>
                        </Box>
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
                        {loginUserId !== post.user_id && (
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={handleLikeToggle}
                                sx={{ mt: 1 }}
                            >
                                {isLiked ? '❤️' : '🤍'} {likeCount}
                            </Button>
                        )}
                    </>
                ) : (
                    <Typography>게시글을 불러오지 못했습니다.</Typography>
                )}

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>댓글</Typography>
                {comments.map((comment) => (
                    <Box key={comment.comment_id} mb={2}>
                        <Box display="flex" alignItems="flex-start">
                            <Avatar
                                src={`http://localhost:3005/${comment.profile_img}`}
                                sx={{ width: 36, height: 36, mr: 2 }}
                            />
                            <Box>
                                <Typography variant="subtitle2">
                                    {comment.nickname}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(comment.created_at).toLocaleString()}
                                </Typography>
                                <Typography variant="body1">
                                    {comment.content}
                                </Typography>
                                {loginUserId === comment.user_id && (
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleCommentDelete(comment.comment_id)}
                                    >
                                        삭제
                                    </Button>
                                )}
                                <Button
                                    size="small"
                                    startIcon={<ReplyIcon />}
                                    onClick={() =>
                                        setReplyTargetId(
                                            replyTargetId === comment.comment_id ? null : comment.comment_id
                                        )
                                    }
                                >
                                    답글
                                </Button>
                                {replyTargetId === comment.comment_id && (
                                    <Stack direction="row" spacing={1} mt={1}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="답글을 입력하세요"
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={() => handleReplySubmit(comment.comment_id)}
                                        >
                                            등록
                                        </Button>
                                    </Stack>
                                )}
                            </Box>
                        </Box>
                        {comment.replies && comment.replies.map((reply) => (
                            <Box
                                key={reply.comment_id}
                                display="flex"
                                alignItems="flex-start"
                                mt={1}
                                ml={6}
                            >
                                <Avatar
                                    src={`http://localhost:3005/${reply.profile_img}`}
                                    sx={{ width: 30, height: 30, mr: 2 }}
                                />
                                <Box>
                                    <Typography variant="subtitle2">{reply.nickname}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(reply.created_at).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body1">{reply.content}</Typography>
                                    {loginUserId === reply.user_id && (
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => handleCommentDelete(reply.comment_id)}
                                        >
                                            삭제
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={2}>
                    <TextField
                        fullWidth
                        placeholder="댓글을 입력하세요"
                        size="small"
                        value={newComment}
                        onChange={handleCommentChange}
                    />
                    <Button variant="contained" onClick={handleCommentSubmit}>등록</Button>
                </Stack>

                {showMentionList && (
                    <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1, mt: 1 }}>
                        {mentionSuggestions.length > 0 ? (
                            mentionSuggestions.map((user) => (
                                <Typography
                                    key={`${user.user_key}-${user.nickname}`}
                                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#eee' } }}
                                    onClick={() => handleMentionSelect(user.user_key)}
                                >
                                    {user.nickname} (@{user.user_key})
                                </Typography>
                            ))
                        ) : (
                            <Typography color="text.secondary">검색 결과 없음</Typography>
                        )}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default FeedDetail;
