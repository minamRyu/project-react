import React, { useState } from 'react';
import { TextField, Box, Typography } from '@mui/material';

function MentionInput({ value, onChange, onMentionSelect, token }) {
    const [mentionSuggestions, setMentionSuggestions] = useState([]);
    const [showMentionList, setShowMentionList] = useState(false);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);

        const mentionMatch = newValue.match(/@(\w*)$/);
        if (mentionMatch) {
            const query = mentionMatch[1];
            const endpoint = query === ''
                ? 'http://localhost:3005/member/recommendations'
                : `http://localhost:3005/member/search?query=${query}`;

            fetch(endpoint, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setMentionSuggestions(data.data);
                        setShowMentionList(true);
                    }
                });
        } else {
            setShowMentionList(false);
        }
    };

    const handleSuggestionClick = (userKey) => {
        const newText = value.replace(/@(\w*)$/, `@${userKey} `);
        onChange(newText);
        setShowMentionList(false);
    };

    return (
        <Box position="relative">
            <TextField
                fullWidth
                size="small"
                value={value}
                onChange={handleInputChange}
                placeholder="내용을 입력하세요"
            />
            {showMentionList && (
                <Box sx={{ position: 'absolute', top: '100%', left: 0, right: 0, bgcolor: 'white', zIndex: 10, border: '1px solid #ddd' }}>
                    {mentionSuggestions.map(user => (
                        <Typography
                            key={`${user.user_key}-${user.nickname}`}
                            sx={{ cursor: 'pointer', p: 1, '&:hover': { backgroundColor: '#eee' } }}
                            onClick={() => handleSuggestionClick(user.user_key)}
                        >
                            {user.nickname} (@{user.user_key})
                        </Typography>
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default MentionInput;
