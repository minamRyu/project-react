import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box } from '@mui/material';
import { SaveAlt, LoginTwoTone, FeedTwoTone, Pageview, LogoutOutlined, Home } from '@mui/icons-material'

import Login from '../pages/Login';
import Join from '../pages/Join';
import FeedAdd from '../pages/FeedAdd';
import MyPage from '../pages/MyPage';
import Logout from '../pages/Logout';
import FeedList from '../pages/FeedList';
import FeedDetail from '../pages/FeedDetail';
import UserProfile from '../pages/UserProfile';

const drawerWidth = 240;

const menuItems = [
    { text: 'FeedList', icon: <FeedTwoTone />, path: '/feedList' },
    { text: 'MyPage', icon: <Pageview />, path: '/myPage' },
    { text: 'Logout', icon: <LogoutOutlined />, path: '/logout' },
];

function AppRouter() {
    const location = useLocation(); 

    // 로그인 페이지에서는 사이드바 숨기기
    const isLoginPage = location.pathname === '/login';

    return (
        <Box sx={{ display: 'flex' }}>
            {/* 사이드바 - 로그인 페이지에서는 숨기기 */}
            {!isLoginPage && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { 
                            width: drawerWidth, 
                            boxSizing: 'border-box',
                            backgroundColor: '#f5f5f5', 
                            paddingTop: 2,
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
            )}

            {/* 메인 컨텐츠 영역 */}
            <Box component="main" sx={{ flexGrow: 1, bgcolor: '#fafafa', p: 3 }}>
                <Toolbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/join" element={<Join />} />
                    <Route path="/feedList" element={<FeedList />} />
                    <Route path="/feedAdd" element={<FeedAdd />} />
                    <Route path="/myPage" element={<MyPage />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/feedDetail/:postId" element={<FeedDetail open={true} onClose={() => {}} />} />
                    <Route path="/profile/:userId" element={<UserProfile />} />
                </Routes>
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