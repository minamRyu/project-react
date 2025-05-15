// src/pages/Logout.js
import { useEffect } from 'react';

function Logout() {
    useEffect(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }, []);

    return <p>로그아웃 중입니다...</p>; 
}

export default Logout;