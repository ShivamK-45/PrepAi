import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router';
import { useMockInterview } from '../hooks/useMockInterview';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import '../style/liveInterview.scss';

const LiveInterview = () => {
    const { sessionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const { handleSaveAnswer, handleComplete, loading } = useMockInterview();
    const { 
        isRecording, 
        transcript, 
        duration, 
        error: recError,
        isInitializing,
        startRecording, 
        stopRecording,
        resetRecording 
    } = useAudioRecorder();

    // Session data from navigation state
    const [sessionData, setSessionData] = useState(location.state?.sessionData || null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [timer, setTimer] = useState(0);
    const [status, setStatus] = useState('loading'); // loading, speaking, listening, processing

    // Timer for interview duration
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Initialize first question
    useEffect(() => {
        if (sessionData?.firstQuestion) {
            setCurrentQuestion(sessionData.firstQuestion);
            playQuestionAudio(sessionData.firstQuestion.audio);
        }
    }, [sessionData]);

    // Play question audio
    const playQuestionAudio = (audioBase64) => {
        setStatus('speaking');
        
        // Convert base64 to audio blob
        const audioBlob = base64ToBlob(audioBase64, 'audio/mp3');
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.play();
        
        audio.onended = () => {
            setStatus('listening');
            URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = (e) => {
            console.error('Audio playback error:', e);
            setStatus('listening'); // Continue even if audio fails
        };
    };

    // Convert base64 to blob
    const base64ToBlob = (base64, mimeType) => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    };

    // Handle mic button click
    const handleMicClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // Submit answer and move to next
    const handleSubmitAnswer = async () => {
        if (!transcript.trim()) {
            alert('Please record an answer before proceeding');
            return;
        }

        setStatus('processing');
        stopRecording();

        try {
            const response = await handleSaveAnswer({
                sessionId,
                questionIndex: currentQuestionIndex,
                transcript: transcript.trim(),
                duration
            });

            resetRecording();

            if (response.isComplete) {
                // No more questions, complete interview
                handleCompleteInterview();
            } else if (response.nextQuestion) {
                // Move to next question
                setCurrentQuestionIndex(response.nextQuestion.index);
                setCurrentQuestion(response.nextQuestion);
                playQuestionAudio(response.nextQuestion.audio);
            }
        } catch (err) {
            console.error('Error saving answer:', err);
            alert('Failed to save answer. Please try again.');
            setStatus('listening');
        }
    };

    // Complete interview
    const handleCompleteInterview = async () => {
    setStatus('processing');
    
    // Check if any answers exist
    if (!sessionId) {
        alert('Session not found');
        navigate('/');
        return;
    }
    
    try {
        console.log('Completing interview with sessionId:', sessionId);
        const result = await handleComplete(sessionId);
        console.log('Interview completed:', result);
        navigate(`/mock-results/${sessionId}`);
    } catch (err) {
        console.error('Error completing interview:', err);
        alert(`Failed to complete interview: ${err.message}. Redirecting to dashboard...`);
        navigate('/');
    }
    };

    // End interview early
    const handleEndInterview = () => {
        const confirmed = window.confirm('Are you sure you want to end the interview? Your progress will be saved.');
        if (confirmed) {
            handleCompleteInterview();
        }
    };

    // Format time (seconds to mm:ss)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate progress
    const totalQuestions = sessionData?.questions?.length || 8;
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    if (!sessionData) {
        return (
            <div className="live-interview-error">
                <h2>Session not found</h2>
                <button onClick={() => navigate('/mock-setup')}>Back to Setup</button>
            </div>
        );
    }

    return (
        <div className="live-interview">
            {/* Top Bar */}
            <div className="interview-topbar">
                <div className="topbar-left">
                    <span className="logo">PrepAI</span>
                </div>
                <div className="topbar-center">
                    <span className="timer">{formatTime(timer)}</span>
                </div>
                <div className="topbar-right">
                    <button className="end-button" onClick={handleEndInterview}>
                        End Interview
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="interview-content">
                {/* AI Status */}
                <div className="ai-section">
                    <div className={`ai-avatar ${status === 'speaking' ? 'speaking' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                        </svg>
                    </div>
                    <p className="ai-status">
                        {status === 'loading' && 'Preparing...'}
                        {status === 'speaking' && 'AI Speaking...'}
                        {status === 'listening' && 'Listening...'}
                        {status === 'processing' && 'Processing...'}
                    </p>
                </div>

                {/* Question Display */}
                {currentQuestion && (
                    <div className="question-display">
                        <div className="question-text">
                            {currentQuestion.question}
                        </div>
                        <div className="question-meta">
                            <span className="question-number">
                                Question {currentQuestionIndex + 1} of {totalQuestions}
                            </span>
                            <span className={`question-category ${currentQuestion.category}`}>
                                {currentQuestion.category}
                            </span>
                        </div>
                    </div>
                )}

                {/* Audio Visualizer */}
                <div className="audio-visualizer">
                    <div className={`bar ${isRecording ? 'active' : ''}`}></div>
                    <div className={`bar ${isRecording ? 'active' : ''}`}></div>
                    <div className={`bar ${isRecording ? 'active' : ''}`}></div>
                    <div className={`bar ${isRecording ? 'active' : ''}`}></div>
                    <div className={`bar ${isRecording ? 'active' : ''}`}></div>
                </div>

                {/* Transcript Preview */}
                {transcript && (
                    <div className="transcript-preview">
                        <p className="transcript-label">Your answer:</p>
                        <p className="transcript-text">{transcript}</p>
                    </div>
                )}

                {/* Microphone Button */}
                <div className="mic-controls">
                    <button 
                        className={`mic-button ${isRecording ? 'recording' : ''} ${isInitializing ? 'initializing' : ''}`}
                        onClick={handleMicClick}
                        disabled={status === 'processing' || status === 'speaking' || isInitializing}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                            <line x1="12" y1="19" x2="12" y2="23"/>
                            <line x1="8" y1="23" x2="16" y2="23"/>
                        </svg>
                    </button>
                    {isInitializing && (
                        <p className="recording-duration">Starting...</p>
                    )}
                    {isRecording && !isInitializing && (
                        <p className="recording-duration">{formatTime(duration)}</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    {transcript && !isRecording && (
                        <button 
                            className="submit-button"
                            onClick={handleSubmitAnswer}
                            disabled={loading || status === 'processing'}
                        >
                            {loading ? 'Submitting...' : 'Submit & Continue'}
                        </button>
                    )}
                </div>

                {/* Error Display */}
                {recError && (
                    <div className="error-message">
                        ⚠️ {recError}
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="interview-footer">
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="progress-text">
                    {totalQuestions - (currentQuestionIndex + 1)} questions remaining
                </p>
            </div>
        </div>
    );
};

export default LiveInterview;