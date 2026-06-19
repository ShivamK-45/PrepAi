// e:\Projects\PrepAI\frontend\src\features\landing\pages\Landing.jsx
import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import Hero from '../components/Hero';
import FeaturesGrid from '../components/FeaturesGrid';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import '../landing.scss';

const Landing = () => {
  const { user, handleLogout } = useAuth();
  const isAuthenticated = !!user;

  return (
    <div className="landing-container">
      {/* Sticky Custom Navbar */}
      <nav className="landing-navbar">
        <Link to="/" className="nav-logo">
          <span className="logo-main">PrepAI</span>
          <span className="logo-sub">AI DIGITAL MENTOR</span>
        </Link>
        
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
        </div>
        
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-btn btn-signup">
                Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="nav-btn btn-login"
                style={{ cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn btn-login">
                Login
              </Link>
              <Link to="/register" className="nav-btn btn-signup">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Sections */}
      <Hero isAuthenticated={isAuthenticated} />
      
      <FeaturesGrid />
      
      <HowItWorks />

      {/* CTA Banner Section */}
      <section className="cta-banner-section">
        <div className="cta-banner">
          <h2>Ready to Ace Your Next Interview?</h2>
          <p>
            Join thousands of successful candidates who used PrepAI mock simulations to land jobs at top tier organizations.
          </p>
          {isAuthenticated ? (
            <Link to="/dashboard" className="cta-btn">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/register" className="cta-btn">
              Get Started for Free
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
