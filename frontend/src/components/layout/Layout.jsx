import React from 'react';
import { useLocation } from 'react-router';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import './layout.scss';

const Layout = ({ children }) => {
    const location = useLocation();
    const isFullPage = location.pathname.toLowerCase().includes('/interview');

    return (
        <div className="app-layout">
            <div className="logo-container">
                <span className="logo-text">PrepAI</span>
                <span className="tagline-text">AI DIGITAL MENTOR</span>
            </div>
            <Sidebar />
            <div className="main-container">
                <TopNavbar />
                <main className={`content-area ${isFullPage ? 'content-area--full' : ''}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
