import { useState, useEffect } from 'react';
import { getLatestPreparation, getLatestMockInterview } from '../services/dashboard.api';

export const useDashboard = () => {
    const [latestPrep, setLatestPrep] = useState(null);
    const [latestMock, setLatestMock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch both latest sessions in parallel
                const [prepData, mockData] = await Promise.all([
                    getLatestPreparation(),
                    getLatestMockInterview()
                ]);

                setLatestPrep(prepData);
                setLatestMock(mockData);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return {
        latestPrep,
        latestMock,
        loading,
        error
    };
};