import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box } from '@mui/material';
import { SaveAlt, LoginTwoTone } from '@mui/icons-material'

import Login from '../pages/Login';
import Join from '../pages/Join';
import Feed from '../pages/Feed';

const drawerWidth = 240;

const menuItems = [
    { text: 'Login.js', icon: <LoginTwoTone />, path: '/login' },
    { text: 'Join.js', icon: <SaveAlt />, path: '/join' },
    { text: 'Feed.js', icon: <LoginTwoTone />, path: '/feed' },
    
];

function AppRouter() {
    const location = useLocation(); // 현재 URL 확인

    return (
        <Box sx={{ display: 'flex' }}>
        {/* 사이드바 */}
        <Drawer
            variant="permanent"
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
                width: drawerWidth, 
                boxSizing: 'border-box',
                backgroundColor: '#f5f5f5', // 배경 색
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
                    selected={location.pathname === item.path} // 현재 경로에 하이라이트
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

        {/* 메인 컨텐츠 영역 */}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: '#fafafa', p: 3 }}>
            <Toolbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<Join />} />
                <Route path="/feed" element={<Feed />} />
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