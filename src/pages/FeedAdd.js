import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
    TextField, Button, Box, Typography, Stack
} from '@mui/material';

function FeedAdd() {
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
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
            navigate("/feedList");
        } catch (err) {
            console.error('등록 실패:', err);
        }
    };

    return (
        <Box p={2}>
            <Typography variant="h6">새 게시물 등록</Typography>
            <TextField
                fullWidth
                multiline
                rows={4}
                label="내용"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                margin="normal"
            />
            <input type="file" multiple onChange={handleImageChange} />
            <Stack direction="row" spacing={2} mt={2}>
                <Button variant="contained" onClick={handleSubmit}>
                등록
                </Button>
            </Stack>
        </Box>
    );
}

export default FeedAdd;