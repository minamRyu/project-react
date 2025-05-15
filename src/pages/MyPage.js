import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';
import MyInfoSection from './MyInfoSection';
import MyFeedSection from './MyFeedSection';
import NotificationSection from './NotificationSection';

function MyPage() {
    const [activeTab, setActiveTab] = useState('info');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <Box
            sx={{
                mt: 18,
                backgroundColor: 'var(--color-current-line)',
                color: 'var(--color-foreground)',
                border: '2px solid var(--color-purple)',
                borderRadius: '8px',
                width: '600px',
                p: 3,
            }}
        >
            <Box display="flex" gap={2} mb={3}>
                {['info', 'feed', 'notifications'].map((tab) => (
                    <Button
                        key={tab}
                        variant={activeTab === tab ? 'contained' : 'outlined'}
                        onClick={() => handleTabChange(tab)}
                        sx={{
                            backgroundColor: activeTab === tab ? 'var(--color-cyan)' : 'var(--color-current-line)',
                            color: activeTab === tab ? 'var(--color-background)' : 'var(--color-red)',
                            fontWeight: 'bold',
                            border: '1px solid var(--color-purple)',
                            '&:hover': {
                                backgroundColor: 'var(--color-yellow)',
                                color: 'var(--color-background)',
                            },
                        }}
                    >
                        {tab === 'info' && '내 정보'}
                        {tab === 'feed' && '내 피드'}
                        {tab === 'notifications' && '알림 목록'}
                    </Button>
                ))}
            </Box>

            {activeTab === 'info' && <MyInfoSection />}
            {activeTab === 'feed' && <MyFeedSection />}
            {activeTab === 'notifications' && <NotificationSection />}
        </Box>
    );
}

export default MyPage;