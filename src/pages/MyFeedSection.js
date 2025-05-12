import React, { useState, useEffect } from 'react';
import { Container, Card, CardHeader, CardContent, Button, Typography, Avatar, ImageList, ImageListItem } from '@mui/material';
import FeedDetail from './FeedDetail';

function MyFeedSection() {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [page, setPage] = useState(1);
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    loadMyFeeds(page);
  }, [page]);

  const loadMyFeeds = (pageToLoad = 1) => {
    setLoading(true);
    fetch(`http://localhost:3005/feed/my-feeds?page=${pageToLoad}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.posts.length > 0) {
            setPosts(data.posts);
          }
          if (data.posts.length < 10) {
            setHasMorePosts(false);
          }
        } else {
          console.error('게시글 불러오기 실패:', data.message);
        }
      })
      .catch(err => console.error('게시글 불러오기 오류:', err))
      .finally(() => setLoading(false));
  };

  const handleLoadMore = () => {
    if (hasMorePosts) {
      setPage(prevPage => prevPage + 1);
    }
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
      <Typography variant="h6" gutterBottom>내가 작성한 게시글</Typography>
      {loading && <Typography>로딩 중...</Typography>}
      
      {posts.length === 0 ? (
        <Typography>작성한 게시글이 없습니다.</Typography>
      ) : (
        posts.map((post) => (
          <Card key={post.post_id} sx={{ mb: 4, cursor: 'pointer' }} onClick={() => setSelectedPostId(post.post_id)}>
            <CardHeader
              avatar={<Avatar src={`http://localhost:3005/${post.profile_img}`} />}
              title={post.nickname}
              subheader={new Date(post.created_at).toLocaleString()}
            />
            <CardContent>
              <Typography variant="body1" gutterBottom>{post.content}</Typography>
              <ImageList cols={3} gap={8}>
                {post.images.map((img, index) => (
                  <ImageListItem key={index}>
                    <img src={`http://localhost:3005${img.image_url}`} alt={`img-${index}`} loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                ❤️ {post.like_count}명이 좋아합니다
              </Typography>
              {post.user_id === post.user_id && (
                <Button variant="outlined" color="error" size="small" onClick={(e) => { e.stopPropagation(); handleDelete(post.post_id); }} sx={{ mt: 2 }}>
                  삭제
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}

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

export default MyFeedSection;
