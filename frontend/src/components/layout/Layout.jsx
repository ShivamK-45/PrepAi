import React from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import './layout.scss';

const Layout = ({ children }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-container">
                <TopNavbar />
                <main className="content-area">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
