// e:\Projects\PrepAI\frontend\src\features\landing\components\Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="landing-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="brand-name">PrepAI</span>
          <span className="brand-desc">Your AI-powered digital interview mentor.</span>
        </div>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PrepAI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
