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
        <Box sx={{ padding: 2 }}>
        {/* 탭 버튼 */}
        <Box display="flex" gap={2} mb={3}>
            <Button
                variant={activeTab === 'info' ? 'contained' : 'outlined'}
                onClick={() => handleTabChange('info')}
            >
            내 정보
            </Button>
            <Button
                variant={activeTab === 'feed' ? 'contained' : 'outlined'}
                onClick={() => handleTabChange('feed')}
            >
            내 피드
            </Button>
            <Button
                variant={activeTab === 'notifications' ? 'contained' : 'outlined'}
                onClick={() => handleTabChange('notifications')}
            >
            알림 목록
            </Button>
        </Box>

        {/* 각 탭별 콘텐츠 출력 */}
        {activeTab === 'info' && <MyInfoSection />}
        {activeTab === 'feed' && <MyFeedSection />}
        {activeTab === 'notifications' && <NotificationSection />} 
        </Box>
    );
}

export default MyPage;