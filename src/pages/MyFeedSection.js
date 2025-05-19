import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Button, Typography, Avatar, ImageList, ImageListItem, Box } from '@mui/material';
import FeedDetail from './FeedDetail';
import { useParams , useNavigate } from 'react-router-dom';
import CharacterAlert from './CharacterAlert';
import '../styles/character.css';

function MyFeedSection() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [hasMorePosts, setHasMorePosts] = useState(true);
	const [page, setPage] = useState(1);
	const [openFeedDetail, setOpenFeedDetail] = useState(false);
	const { postId } = useParams();
	const navigate = useNavigate();
	const [pendingDeletePostId, setPendingDeletePostId] = useState(null);

	const token = localStorage.getItem('token');
	
	useEffect(() => {
		loadMyFeeds(page);
	}, [page]);

	const loadMyFeeds = (pageToLoad = 1) => {
		setLoading(true);
		const token = localStorage.getItem('token');
			if (!token) {
				console.error('토큰이 없습니다.');
				return;
			}
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
				setPendingDeletePostId(postId); 
			} else {
				alert(data.message || '삭제 실패');
			}
		})
		.catch(err => console.error('삭제 요청 실패:', err));
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
		<Box>
			{loading && <Typography>로딩 중...</Typography>}

			{posts.length === 0 ? (
				<Typography>작성한 게시글이 없습니다.</Typography>
			) : (
				posts.map((post) => (
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
						<Button
							variant="outlined"
							color="error"
							size="small"
							sx={{ mt: 2 }}
							onClick={(e) => {
								e.stopPropagation();
								handleDelete(post.post_id);
							}}
						>
							삭제
						</Button>
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
				))
			)}

			{hasMorePosts && (
				<Button
					variant="contained"
					sx={{
						mt: 2,
						backgroundColor: 'var(--color-cyan)',
						color: 'var(--color-background)',
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
	);
}

export default MyFeedSection;