import axios from 'helper/axios';
import React, { useEffect, useState } from 'react';

export const useBranch = () => {
    const [branchData, setBranchData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/branches/get_all/');
                setBranchData(response.data.all_branches);
            } catch (err) {
                setError('Failed to fetch branch data');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { branchData, isLoading, error };
};
