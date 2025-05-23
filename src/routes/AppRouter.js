import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box } from '@mui/material';
import { FeedTwoTone, Pageview, LogoutOutlined } from '@mui/icons-material'

import '../styles/theme.css';

import Login from '../pages/Login';
import Join from '../pages/Join';
import FeedAdd from '../pages/FeedAdd';
import MyPage from '../pages/MyPage';
import Logout from '../pages/Logout';
import FeedList from '../pages/FeedList';
import FeedDetail from '../pages/FeedDetail';

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
                    justifyContent: 'center',  
                    alignItems: 'flex-start',
                    width: 'auto',             
                    maxWidth: isLoginPage ? '500px' : '600px',  
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
                    <Drawer
                        variant="permanent"
                        sx={{
                            mt: 21,
                            border: '2px solid var(--color-purple)',
                            borderRadius: '6px',
                            position: 'fixed',
                            top: 65,
                            left: 400,
                            width: '240px',
                            flexShrink: 0,
                            [`& .MuiDrawer-paper`]: {
                                position: 'relative',
                                width: '240px',
                                boxSizing: 'border-box',
                                backgroundColor: 'var(--color-current-line)',  
                                color: 'var(--color-foreground)',              
                            },
                        }}
                    >
                        <Toolbar>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ textAlign: 'center', width: '100%', color: 'var(--color-green)', fontWeight: 'bold', fontSize: '30px' }}
                            >
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
                                            color: 'var(--color-foreground)',  
                                            '&.Mui-selected': {
                                                backgroundColor: 'var(--color-yellow)',  
                                                color: 'var(--color-background)',
                                                fontWeight: 'bold',
                                            },
                                            '&:hover': {
                                                backgroundColor: 'var(--color-cyan)',   
                                                color: 'var(--color-background)',
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: 'var(--color-red)', fontSize: 32 }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                sx: { color: 'var(--color-orange)', fontSize: '20px', fontWeight: 'bold' }  
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Drawer>

                    <Box sx={{ p: 3, width: '100%' }}>
                        <Routes>
                            <Route path="/feedList" element={<FeedList />} />
                            <Route path="/feedAdd" element={<FeedAdd />} />
                            <Route path="/myPage" element={<MyPage />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="/feedDetail/:postId" element={<FeedDetail open={true} onClose={() => {}} />} />
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