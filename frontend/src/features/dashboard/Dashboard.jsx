import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/hooks/useAuth';
import { useDashboard } from './hooks/useDashboard';
import './dashboard.scss';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { latestPrep, latestMock, loading } = useDashboard();

    if (loading) {
        return (
            <div className="dashboard-loading">
                <h2>Loading your dashboard...</h2>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Welcome Section */}
            <section className="welcome-section">
                <h1>Welcome, {user?.username || 'User'}</h1>
                <p>What would you like to work on today?</p>
            </section>

            {/* Mode Cards */}
            <section className="mode-cards">
                {/* Interview Preparation Card */}
                <div className="mode-card">
                    <div className="card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        </svg>
                    </div>
                    <h2>Interview Preparation</h2>
                    <p className="card-description">
                        Deep dive into company-specific questions with a structured learning path tailored to your skill gaps.
                    </p>
                    <ul className="card-features">
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Customized questions
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            5-day roadmap
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Skill gap analysis
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Downloadable materials
                        </li>
                    </ul>
                    <p className="card-timing">Best for: 3-5 days before interview</p>
                    <button 
                        className="card-button"
                        onClick={() => navigate('/preparation')}
                    >
                        Start Preparing
                    </button>
                </div>

                {/* AI Mock Interview Card */}
                <div className="mode-card mode-card-featured">
                    <span className="new-badge">NEW</span>
                    <div className="card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                            <line x1="12" y1="19" x2="12" y2="23"/>
                            <line x1="8" y1="23" x2="16" y2="23"/>
                        </svg>
                    </div>
                    <h2>AI Mock Interview</h2>
                    <p className="card-description">
                        Simulate real pressure with our voice-enabled AI mentor. Receive live feedback on your delivery and confidence.
                    </p>
                    <ul className="card-features">
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Voice-based practice
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            15-20 min sessions
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Instant scores
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Confidence analysis
                        </li>
                    </ul>
                    <p className="card-timing">Best for: 1-2 days before interview</p>
                    <button 
                        className="card-button card-button-primary"
                        onClick={() => navigate('/mock-setup')}
                    >
                        Start Interview
                    </button>
                </div>
            </section>

            {/* Recent Sessions */}
            <section className="recent-sessions">
                <h2>Your Recent Sessions</h2>
                
                <div className="sessions-grid">
                    {/* Latest Preparation Session */}
                    {latestPrep ? (
                        <div className="session-card">
                            <div className="session-header">
                                <span className="session-type prep">PREPARATION</span>
                                <span className="session-score">{latestPrep.matchScore}%</span>
                            </div>
                            <h3>{latestPrep.title || 'Interview Preparation'}</h3>
                            <p className="session-date">
                                {new Date(latestPrep.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                            <button 
                                className="view-button"
                                onClick={() => navigate(`/interview/${latestPrep._id}`)}
                            >
                                View Details
                            </button>
                        </div>
                    ) : (
                        <div className="session-card session-card-empty">
                            <p>No preparation sessions yet</p>
                            <button 
                                className="view-button"
                                onClick={() => navigate('/preparation')}
                            >
                                Create First Session
                            </button>
                        </div>
                    )}

                    {/* Latest Mock Interview Session */}
                    {latestMock ? (
                        <div className="session-card">
                            <div className="session-header">
                                <span className="session-type mock">MOCK</span>
                                <span className="session-score">{latestMock.finalScore?.overall || 0}%</span>
                            </div>
                            <h3>{latestMock.jobRole}</h3>
                            <p className="session-date">
                                {new Date(latestMock.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                            <button 
                                className="view-button"
                                onClick={() => navigate(`/mock-results/${latestMock._id}`)}
                            >
                                View Details
                            </button>
                        </div>
                    ) : (
                        <div className="session-card session-card-empty">
                            <p>No mock interviews yet</p>
                            <button 
                                className="view-button"
                                onClick={() => navigate('/mock-setup')}
                            >
                                Start First Interview
                            </button>
                        </div>
                    )}
                </div>

                {/* View All Button */}
                <button 
                    className="view-all-button"
                    onClick={() => navigate('/activity')}
                >
                    View All Activity →
                </button>
            </section>
        </div>
    );
};

export default Dashboard;