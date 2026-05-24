const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Initialize mock interview session
 */
export const initializeMockInterview = async ({ resumeFile, jobRole, jobDescription, duration }) => {
    try {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('jobRole', jobRole);
        formData.append('duration', duration);
        if (jobDescription) {
            formData.append('jobDescription', jobDescription);
        }

        const response = await fetch(`${API_URL}/api/mock-interview/initialize`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to initialize mock interview');
        }

        return await response.json();
    } catch (error) {
        console.error('Error initializing mock interview:', error);
        throw error;
    }
};

/**
 * Save user's answer during interview
 */
export const saveAnswer = async ({ sessionId, questionIndex, transcript, duration }) => {
    try {
        const response = await fetch(`${API_URL}/api/mock-interview/save-answer`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId,
                questionIndex,
                transcript,
                duration
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save answer');
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving answer:', error);
        throw error;
    }
};

/**
 * Complete mock interview session
 */
export const completeMockInterview = async (sessionId) => {
    try {
        const response = await fetch(`${API_URL}/api/mock-interview/complete`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to complete interview');
        }

        return await response.json();
    } catch (error) {
        console.error('Error completing interview:', error);
        throw error;
    }
};

/**
 * Get mock interview session by ID
 */
export const getMockSessionById = async (sessionId) => {
    try {
        const response = await fetch(`${API_URL}/api/mock-interview/session/${sessionId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch session');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching session:', error);
        throw error;
    }
};