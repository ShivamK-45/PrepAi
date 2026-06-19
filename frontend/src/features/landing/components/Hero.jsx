// e:\Projects\PrepAI\frontend\src\features\landing\components\Hero.jsx
import React from 'react';
import { Link } from 'react-router';

const Hero = ({ isAuthenticated }) => {
  return (
    <section className="hero-section" id="home">
      <div className="badge">
        <span>AI-Powered Interview Coach</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </div>
      
      <h1 className="hero-title">
        Master Your Next Interview with <span className="gradient-text">PrepAI</span>
      </h1>
      
      <p className="hero-subtitle">
        Practice realistic AI simulations, receive real-time behavioral insights, and build the confidence to land your dream job.
      </p>
      
      <div className="hero-ctas">
        {isAuthenticated ? (
          <Link to="/dashboard" className="cta-btn primary">
            Go to Dashboard
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        ) : (
          <>
            <Link to="/register" className="cta-btn primary">
              Get Started for Free
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link to="/login" className="cta-btn secondary">
              Login to Account
            </Link>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;
