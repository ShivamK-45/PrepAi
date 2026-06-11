import React from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import './topNavbar.scss';

const TopNavbar = () => {
    const { user, handleLogout } = useAuth();

    // Get first letter of username for avatar
    const getInitial = () => {
        if (!user || !user.username) return 'U';
        return user.username.charAt(0).toUpperCase();
    };

    return (
        <header className="top-navbar">
            <div className="navbar-left">
                {/* Logo is now rendered in the top-left logo-container */}
            </div>

            <div className="navbar-right">
                {/* Notification Icon */}
                <button className="icon-button" aria-label="Notifications">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                </button>

                {/* Settings Icon */}
                <button className="icon-button" aria-label="Settings">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M1 12h6m6 0h6m-13.2 5.2l4.2-4.2m0-6l-4.2-4.2"/>
                    </svg>
                </button>

                {/* User Avatar with Dropdown */}
                <div className="user-menu">
                    <button className="user-avatar" aria-label="User menu">
                        {getInitial()}
                    </button>
                    <div className="user-dropdown">
                        <div className="dropdown-header">
                            <p className="user-name">{user?.username || 'User'}</p>
                            <p className="user-email">{user?.email || ''}</p>
                        </div>
                        <button onClick={handleLogout} className="logout-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;