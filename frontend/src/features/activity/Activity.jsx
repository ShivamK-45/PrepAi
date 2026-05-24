import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getAllInterviewReportsController } from '../interview/services/interview.api';
import { getMockSessionById } from '../mockInterview/services/mockInterview.api';
import './activity.scss';

const Activity = () => {
    const navigate = useNavigate();
    
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'preparation', 'mock'
    const [sortBy, setSortBy] = useState('date'); // 'date', 'score'

    useEffect(() => {
        fetchAllSessions();
    }, []);

    const fetchAllSessions = async () => {
        setLoading(true);
        try {
            // Fetch preparation sessions
            const prepResponse = await fetch('http://localhost:3000/api/interview', {
                credentials: 'include'
            });
            const prepData = await prepResponse.json();

            // Fetch mock interview sessions
            const mockResponse = await fetch('http://localhost:3000/api/mock-interview/sessions', {
                credentials: 'include'
            });
            const mockData = await mockResponse.json();

            // Combine both types
            const prepSessions = (prepData.interviewReports || []).map(session => ({
                ...session,
                type: 'preparation',
                score: session.matchScore,
                jobTitle: session.title,
                date: session.createdAt
            }));

            const mockSessions = (mockData.sessions || []).map(session => ({
                ...session,
                type: 'mock',
                score: session.finalScore?.overall || 0,
                jobTitle: session.jobRole,
                date: session.createdAt
            }));

            const allSessions = [...prepSessions, ...mockSessions];
            setSessions(allSessions);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSessions = sessions
        .filter(session => {
            if (filter === 'all') return true;
            return session.type === filter;
        })
        .sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.date) - new Date(a.date);
            } else {
                return b.score - a.score;
            }
        });

    const handleViewSession = (session) => {
        if (session.type === 'preparation') {
            navigate(`/interview/${session._id}`);
        } else {
            navigate(`/mock-results/${session._id}`);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'high';
        if (score >= 60) return 'medium';
        return 'low';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStats = () => {
        const prepCount = sessions.filter(s => s.type === 'preparation').length;
        const mockCount = sessions.filter(s => s.type === 'mock').length;
        const avgScore = sessions.length > 0 
            ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length)
            : 0;

        return { prepCount, mockCount, avgScore };
    };

    const stats = getStats();

    if (loading) {
        return (
            <div className="activity-loading">
                <h2>Loading your activity...</h2>
            </div>
        );
    }

    return (
        <div className="activity-page">
            {/* Header */}
            <div className="activity-header">
                <div className="header-content">
                    <h1>Your Activity</h1>
                    <p>View all your interview preparation and mock interview sessions</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-section">
                <div className="stat-card">
                    <div className="stat-icon prep">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.prepCount}</h3>
                        <p>Preparation Sessions</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon mock">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.mockCount}</h3>
                        <p>Mock Interviews</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon score">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 3v18h18"/>
                            <path d="m19 9-5 5-4-4-3 3"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.avgScore}%</h3>
                        <p>Average Score</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon total">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                    </div>
                    <div className="stat-content">
                        <h3>{sessions.length}</h3>
                        <p>Total Sessions</p>
                    </div>
                </div>
            </div>

            {/* Filters & Sort */}
            <div className="controls-section">
                <div className="filter-buttons">
                    <button 
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Sessions
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'preparation' ? 'active' : ''}`}
                        onClick={() => setFilter('preparation')}
                    >
                        Preparation
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'mock' ? 'active' : ''}`}
                        onClick={() => setFilter('mock')}
                    >
                        Mock Interviews
                    </button>
                </div>

                <div className="sort-dropdown">
                    <label>Sort by:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="date">Recent First</option>
                        <option value="score">Highest Score</option>
                    </select>
                </div>
            </div>

            {/* Sessions List */}
            <div className="sessions-section">
                {filteredSessions.length === 0 ? (
                    <div className="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <h3>No sessions found</h3>
                        <p>
                            {filter === 'all' 
                                ? 'Start your first interview preparation or mock interview!'
                                : `No ${filter} sessions yet`}
                        </p>
                        <button 
                            className="start-button"
                            onClick={() => navigate('/')}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="sessions-table">
                        <div className="table-header">
                            <div className="col-type">Type</div>
                            <div className="col-title">Job Role / Title</div>
                            <div className="col-date">Date</div>
                            <div className="col-score">Score</div>
                            <div className="col-action">Action</div>
                        </div>

                        <div className="table-body">
                            {filteredSessions.map((session) => (
                                <div key={session._id} className="table-row">
                                    <div className="col-type">
                                        <span className={`type-badge ${session.type}`}>
                                            {session.type === 'preparation' ? 'PREP' : 'MOCK'}
                                        </span>
                                    </div>
                                    <div className="col-title">
                                        <h4>{session.jobTitle}</h4>
                                    </div>
                                    <div className="col-date">
                                        <span>{formatDate(session.date)}</span>
                                    </div>
                                    <div className="col-score">
                                        <div className={`score-badge ${getScoreColor(session.score)}`}>
                                            {session.score}%
                                        </div>
                                    </div>
                                    <div className="col-action">
                                        <button 
                                            className="view-button"
                                            onClick={() => handleViewSession(session)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Activity;