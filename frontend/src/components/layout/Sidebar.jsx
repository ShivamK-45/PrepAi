import React from 'react';
import { Link, useLocation } from 'react-router';
import './sidebar.scss';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="sidebar">
            {/* Logo Section */}
            <div className="sidebar-header">
                <h1 className="logo">PrepAI</h1>
                <p className="tagline">AI DIGITAL MENTOR</p>
            </div>

            {/* Navigation Links */}
            <nav className="sidebar-nav">
                <Link 
                    to="/" 
                    className={`nav-item ${isActive('/') ? 'active' : ''}`}
                >
                    <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    <span>DASHBOARD</span>
                </Link>

                <Link 
                    to="/preparation" 
                    className={`nav-item ${isActive('/preparation') ? 'active' : ''}`}
                >
                    <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                    <span>PREPARATION</span>
                </Link>

                <Link 
                    to="/live-practice" 
                    className={`nav-item ${isActive('/live-practice') ? 'active' : ''}`}
                >
                    <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                        <line x1="12" y1="19" x2="12" y2="23"/>
                        <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                    <span>LIVE PRACTICE</span>
                </Link>

                <Link 
                    to="/activity" 
                    className={`nav-item ${isActive('/activity') ? 'active' : ''}`}
                >
                    <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>ACTIVITY</span>
                </Link>
            </nav>

            {/* Bottom Links */}
            <div className="sidebar-footer">
                <a href="#" className="footer-link">
                    <svg className="footer-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <span>HELP CENTER</span>
                </a>

                <a href="#" className="footer-link">
                    <svg className="footer-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M1 12h6m6 0h6m-13.2 5.2l4.2-4.2m0-6l-4.2-4.2"/>
                    </svg>
                    <span>SETTINGS</span>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;
