import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box } from '@mui/material';
import { SaveAlt, LoginTwoTone, FeedTwoTone, Pageview, LogoutOutlined, Home } from '@mui/icons-material'

import '../styles/theme.css';

import Login from '../pages/Login';
import Join from '../pages/Join';
import FeedAdd from '../pages/FeedAdd';
import MyPage from '../pages/MyPage';
import Logout from '../pages/Logout';
import FeedList from '../pages/FeedList';
import FeedDetail from '../pages/FeedDetail';
import UserProfile from '../pages/UserProfile';

const menuItems = [
    { text: 'FeedList', icon: <FeedTwoTone />, path: '/feedList' },
    { text: 'MyPage', icon: <Pageview />, path: '/myPage' },
    { text: 'Logout', icon: <LogoutOutlined />, path: '/logout' },
];

function AppRouter() {
    const location = useLocation(); 
    const isLoginPage = location.pathname === '/login' || location.pathname === '/join' || location.pathname === '/';

    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
            }}
            >
            <Box
                sx={{
                    mt: 8,
                    display: 'flex',
                    flexDirection: isLoginPage ? 'column' : 'row',
                    justifyContent: 'center',  // ✅ 가로 중앙 정렬 유지
                    alignItems: 'flex-start',
                    width: 'auto',             // ✅ 필요 없는 100% 제거
                    maxWidth: isLoginPage ? '500px' : '600px',  // ✅ 고정폭 적용
                }}
            >
                {isLoginPage ? (
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/join" element={<Join />} />
                </Routes>
                ) : (
                <>
                    {/* 사이드 메뉴 */}
                    <Drawer
                    variant="permanent"
                    sx={{
                        position: 'static',
                        width: '240px',
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                        position: 'relative',
                        width: '240px',
                        boxSizing: 'border-box',
                        backgroundColor: "#f5f5f5",
                        },
                    }}
                    >
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div" sx={{ textAlign: 'center', width: '100%' }}>
                        메뉴 목록
                        </Typography>
                    </Toolbar>
                    <List>
                        {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                            component={Link}
                            to={item.path}
                            selected={location.pathname === item.path}
                            sx={{
                                '&.Mui-selected': {
                                backgroundColor: '#c5cae9',
                                color: '#3949ab',
                                fontWeight: 'bold',
                                },
                                '&:hover': {
                                backgroundColor: '#e8eaf6',
                                },
                            }}
                            >
                            <ListItemIcon sx={{ color: 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} sx={{ fontSize: '18px' }} />
                            </ListItemButton>
                        </ListItem>
                        ))}
                    </List>
                    </Drawer>

                    {/* 메인 콘텐츠 */}
                    <Box sx={{ p: 3, width: '100%' }}>
                    <Routes>
                        <Route path="/feedList" element={<FeedList />} />
                        <Route path="/feedAdd" element={<FeedAdd />} />
                        <Route path="/myPage" element={<MyPage />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/feedDetail/:postId" element={<FeedDetail open={true} onClose={() => {}} />} />
                        <Route path="/profile/:userId" element={<UserProfile />} />
                    </Routes>
                    </Box>
                </>
                )}
            </Box>
        </Box>
    );
}

function RouterWrapper() {
    return (
      <BrowserRouter>
            <AppRouter /> 
      </BrowserRouter>
    );
}
  
export default RouterWrapper;