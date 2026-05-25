import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useMockInterview } from '../hooks/useMockInterview';
import '../style/mockResults.scss';

const MockResults = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { handleGetSession, loading } = useMockInterview();
    
    const [session, setSession] = useState(null);
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const data = await handleGetSession(sessionId);
                setSession(data.session);
            } catch (err) {
                console.error('Error fetching session:', err);
                alert('Failed to load results. Redirecting to dashboard...');
                navigate('/');
            }
        };

        fetchSession();
    }, [sessionId]);

    const toggleQuestion = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'score-high';
        if (score >= 60) return 'score-medium';
        return 'score-low';
    };

    const getScoreGrade = (score) => {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B+';
        if (score >= 60) return 'B';
        if (score >= 50) return 'C';
        return 'D';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    if (loading || !session) {
        return (
            <div className="mock-results-loading">
                <h2>Loading your results...</h2>
            </div>
        );
    }

    const { finalScore, strengths, improvements, detailedFeedback, answers, questions, jobRole, createdAt, totalDuration } = session;

    return (
        <div className="mock-results">
            {/* Header */}
            <div className="results-header">
                <button className="back-button" onClick={() => navigate('/')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12"/>
                        <polyline points="12 19 5 12 12 5"/>
                    </svg>
                    Back to Dashboard
                </button>
                
                <div className="header-info">
                    <h1>Mock Interview Report</h1>
                    <div className="meta-info">
                        <span className="job-role">{jobRole}</span>
                        <span className="separator">•</span>
                        <span className="date">{formatDate(createdAt)}</span>
                        <span className="separator">•</span>
                        <span className="duration">Duration: {formatDuration(totalDuration)}</span>
                    </div>
                </div>
            </div>

            {/* Overall Score */}
            <section className="overall-score">
                <div className="score-circle">
                    <svg viewBox="0 0 200 200">
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="12"
                        />
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            strokeDasharray={`${(finalScore.overall / 100) * 565} 565`}
                            strokeDashoffset="0"
                            transform="rotate(-90 100 100)"
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ec4899" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="score-content">
                        <span className="score-number">{finalScore.overall}</span>
                        <span className="score-label">/ 100</span>
                    </div>
                </div>
                
                <div className="score-details">
                    <h2 className={`grade ${getScoreColor(finalScore.overall)}`}>
                        Grade: {getScoreGrade(finalScore.overall)}
                    </h2>
                    <p className="performance-text">
                        {finalScore.overall >= 80 && 'Excellent Performance!'}
                        {finalScore.overall >= 60 && finalScore.overall < 80 && 'Good Performance!'}
                        {finalScore.overall < 60 && 'Keep Practicing!'}
                    </p>
                </div>
            </section>

            {/* Score Breakdown */}
            <section className="score-breakdown">
                <h2>Performance Breakdown</h2>
                <div className="breakdown-grid">
                    <div className="breakdown-item">
                        <div className="breakdown-header">
                            <span className="breakdown-label">Communication</span>
                            <span className={`breakdown-score ${getScoreColor(finalScore.communication)}`}>
                                {finalScore.communication}/100
                            </span>
                        </div>
                        <div className="progress-bar-container">
                            <div 
                                className="progress-bar communication"
                                style={{ width: `${finalScore.communication}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="breakdown-item">
                        <div className="breakdown-header">
                            <span className="breakdown-label">Technical Knowledge</span>
                            <span className={`breakdown-score ${getScoreColor(finalScore.technical)}`}>
                                {finalScore.technical}/100
                            </span>
                        </div>
                        <div className="progress-bar-container">
                            <div 
                                className="progress-bar technical"
                                style={{ width: `${finalScore.technical}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="breakdown-item">
                        <div className="breakdown-header">
                            <span className="breakdown-label">Confidence</span>
                            <span className={`breakdown-score ${getScoreColor(finalScore.confidence)}`}>
                                {finalScore.confidence}/100
                            </span>
                        </div>
                        <div className="progress-bar-container">
                            <div 
                                className="progress-bar confidence"
                                style={{ width: `${finalScore.confidence}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Strengths & Improvements */}
            <section className="feedback-section">
                <div className="feedback-grid">
                    <div className="feedback-card strengths">
                        <h3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Your Strengths
                        </h3>
                        <ul>
                            {strengths?.map((strength, index) => (
                                <li key={index}>{strength}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="feedback-card improvements">
                        <h3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            Areas to Improve
                        </h3>
                        <ul>
                            {improvements?.map((improvement, index) => (
                                <li key={index}>{improvement}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Speaking Analytics */}
            <section className="analytics-section">
                <h2>Speaking Analytics</h2>
                <div className="analytics-grid">
                    <div className="analytics-card">
                        <div className="analytics-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 3v18h18"/>
                                <path d="m19 9-5 5-4-4-3 3"/>
                            </svg>
                        </div>
                        <h4>Speaking Pace</h4>
                        <p className="analytics-value">
                            {Math.round(answers.reduce((sum, a) => sum + a.speakingPace, 0) / answers.length)} WPM
                        </p>
                        <p className="analytics-note">Ideal: 130-160 WPM</p>
                    </div>

                    <div className="analytics-card">
                        <div className="analytics-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                                <line x1="9" y1="9" x2="9.01" y2="9"/>
                                <line x1="15" y1="9" x2="15.01" y2="9"/>
                            </svg>
                        </div>
                        <h4>Filler Words</h4>
                        <p className="analytics-value">
                            {answers.reduce((sum, a) => sum + a.fillerWordCount, 0)}
                        </p>
                        <p className="analytics-note">Total instances (um, uh, like)</p>
                    </div>

                    <div className="analytics-card">
                        <div className="analytics-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                            </svg>
                        </div>
                        <h4>Total Words</h4>
                        <p className="analytics-value">
                            {answers.reduce((sum, a) => sum + a.wordCount, 0)}
                        </p>
                        <p className="analytics-note">Across all answers</p>
                    </div>
                </div>
            </section>

            {/* Detailed Feedback */}
            <section className="detailed-feedback">
                <h2>Detailed Feedback</h2>
                <div className="feedback-content">
                    <p>{detailedFeedback}</p>
                </div>
            </section>

            {/* Question-by-Question Review */}
            <section className="question-review">
                <h2>Question-by-Question Review</h2>
                <div className="questions-list">
                    {answers.map((answer, index) => {
                        const question = questions[answer.questionIndex];
                        const avgScore = Math.round(
                            (answer.scores.clarity + answer.scores.technical + 
                             answer.scores.confidence + answer.scores.completeness) / 4
                        );

                        return (
                            <div key={index} className="question-item">
                                <div 
                                    className="question-header"
                                    onClick={() => toggleQuestion(index)}
                                >
                                    <div className="question-title">
                                        <span className="question-number">Q{index + 1}</span>
                                        <span className={`question-category ${question.category}`}>
                                            {question.category}
                                        </span>
                                        <span className="question-text">{question.questionText}</span>
                                    </div>
                                    <div className="question-meta">
                                        <span className={`question-score ${getScoreColor(avgScore * 10)}`}>
                                            {avgScore}/10
                                        </span>
                                        <svg 
                                            className={`expand-icon ${expandedQuestion === index ? 'expanded' : ''}`}
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width="20" 
                                            height="20" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                        >
                                            <polyline points="6 9 12 15 18 9"/>
                                        </svg>
                                    </div>
                                </div>

                                {expandedQuestion === index && (
                                    <div className="question-details">
                                        <div className="answer-transcript">
                                            <h4>Your Answer:</h4>
                                            <p>{answer.transcript}</p>
                                        </div>

                                        <div className="answer-stats">
                                            <div className="stat">
                                                <span className="stat-label">Duration:</span>
                                                <span className="stat-value">{formatDuration(answer.duration)}</span>
                                            </div>
                                            <div className="stat">
                                                <span className="stat-label">Words:</span>
                                                <span className="stat-value">{answer.wordCount}</span>
                                            </div>
                                            <div className="stat">
                                                <span className="stat-label">Pace:</span>
                                                <span className="stat-value">{answer.speakingPace} WPM</span>
                                            </div>
                                            <div className="stat">
                                                <span className="stat-label">Filler Words:</span>
                                                <span className="stat-value">{answer.fillerWordCount}</span>
                                            </div>
                                        </div>

                                        <div className="answer-scores">
                                            <div className="score-item">
                                                <span>Clarity:</span>
                                                <span className={getScoreColor(answer.scores.clarity * 10)}>
                                                    {answer.scores.clarity}/10
                                                </span>
                                            </div>
                                            <div className="score-item">
                                                <span>Technical:</span>
                                                <span className={getScoreColor(answer.scores.technical * 10)}>
                                                    {answer.scores.technical}/10
                                                </span>
                                            </div>
                                            <div className="score-item">
                                                <span>Confidence:</span>
                                                <span className={getScoreColor(answer.scores.confidence * 10)}>
                                                    {answer.scores.confidence}/10
                                                </span>
                                            </div>
                                            <div className="score-item">
                                                <span>Completeness:</span>
                                                <span className={getScoreColor(answer.scores.completeness * 10)}>
                                                    {answer.scores.completeness}/10
                                                </span>
                                            </div>
                                        </div>

                                        <div className="ai-feedback">
                                            <h4>AI Feedback:</h4>
                                            <p>{answer.aiFeedback}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Action Buttons */}
            <section className="action-buttons">
                <button 
                    className="action-button secondary"
                    onClick={() => navigate('/mock-setup')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="1 4 1 10 7 10"/>
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                    </svg>
                    Retake Interview
                </button>
                <button 
                    className="action-button primary"
                    onClick={() => navigate('/')}
                >
                    Back to Dashboard
                </button>
            </section>
        </div>
    );
};

export default MockResults;