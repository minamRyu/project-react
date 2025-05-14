import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import WitchCharacter from './WitchCharacter';
import '../styles/character.css';
import {
    TextField, Button, Box, Typography, Stack
} from '@mui/material';

function FeedAdd() {
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [showCharacter, setShowCharacter] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
        }
    }, []);
      
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const imageFiles = files.map((file, index) => ({
            file,
            sort_order: index + 1,
        }));
        setImages(imageFiles);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
            formData.append('content', content);
            images.forEach((img, index) => {
            formData.append('images', img.file); 
            formData.append('sortOrders', img.sort_order);
        });

        try {
        const res = await fetch('http://localhost:3005/feed/add', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}` 
            },
            body: formData,
        });
        const data = await res.json();
            // console.log(data);
            setMessage('등록되었습니다.');
            setShowCharacter(true);
        } catch (err) {
            console.error('등록 실패:', err);
        }
    };

    const handleClose = () => {
        setShowCharacter(false); 
        navigate("/feedList");
    };
    return (
        <Box
  sx={{
    mt: 18,
    width: '600px',
    backgroundColor: 'var(--color-current-line)',
    color: 'var(--color-foreground)',
    border: '2px solid var(--color-purple)',
    borderRadius: '8px',
    p: 3,
  }}
>
  <Typography variant="h6" gutterBottom>
    새 게시물 등록
  </Typography>

  <TextField
    fullWidth
    multiline
    rows={4}
    label="내용"
    value={content}
    onChange={(e) => setContent(e.target.value)}
    margin="normal"
    InputLabelProps={{ style: { color: 'var(--color-foreground)' } }}
    InputProps={{ style: { color: 'var(--color-foreground)' } }}
  />

  <input type="file" multiple onChange={handleImageChange} style={{ marginTop: '16px' }} />

  <Stack direction="row" spacing={2} mt={2}>
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
      onClick={handleSubmit}
    >
      등록
    </Button>
    {showCharacter && (
        <WitchCharacter message={message} onClose={handleClose} />
      )}
  </Stack>
</Box>

    );
}

export default FeedAdd;