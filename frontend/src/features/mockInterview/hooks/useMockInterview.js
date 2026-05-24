import { useState } from 'react';
import { 
    initializeMockInterview, 
    saveAnswer, 
    completeMockInterview,
    getMockSessionById 
} from '../services/mockInterview.api';

export const useMockInterview = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sessionData, setSessionData] = useState(null);

    /**
     * Initialize a new mock interview session
     */
    const handleInitialize = async ({ resumeFile, jobRole, jobDescription, duration }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await initializeMockInterview({
                resumeFile,
                jobRole,
                jobDescription,
                duration
            });
            setSessionData(data);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Save user's answer during interview
     */
    const handleSaveAnswer = async ({ sessionId, questionIndex, transcript, duration }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await saveAnswer({
                sessionId,
                questionIndex,
                transcript,
                duration
            });
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Complete the interview session
     */
    const handleComplete = async (sessionId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await completeMockInterview(sessionId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Get session details by ID
     */
    const handleGetSession = async (sessionId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMockSessionById(sessionId);
            setSessionData(data);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        sessionData,
        handleInitialize,
        handleSaveAnswer,
        handleComplete,
        handleGetSession
    };
};