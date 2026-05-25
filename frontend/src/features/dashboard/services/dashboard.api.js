const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Get latest preparation session for logged in user
 */
export const getLatestPreparation = async () => {
    try {
        const response = await fetch(`${API_URL}/api/interview`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch preparation sessions');
        }

        const data = await response.json();
        
        // Return the first (most recent) preparation session
        return data.interviewReports && data.interviewReports.length > 0 
            ? data.interviewReports[0] 
            : null;

    } catch (error) {
        console.error('Error fetching latest preparation:', error);
        return null;
    }
};

/**
 * Get latest mock interview session for logged in user
 */
export const getLatestMockInterview = async () => {
    try {
        const response = await fetch(`${API_URL}/api/mock-interview/sessions`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch mock interview sessions');
        }

        const data = await response.json();
        
        // Return the first (most recent) mock interview session
        return data.sessions && data.sessions.length > 0 
            ? data.sessions[0] 
            : null;

    } catch (error) {
        console.error('Error fetching latest mock interview:', error);
        return null;
    }
};