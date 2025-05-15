import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './routes/AppRouter';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <div
        style={{
            backgroundImage: 'url("/assets/halloween-bg2.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            width: '100%',
            height: '100vh'
        }}
    >
        <AppRouter />
    </div>
);