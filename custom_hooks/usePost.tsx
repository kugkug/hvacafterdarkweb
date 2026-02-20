import { useCallback, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../utilities/auth';

const usePost = (url: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<any>(null);
    const { token } = useAuth();

    const postData = useCallback(
        async (data: object) => {
            setLoading(true);
            setError(null);

            try {
                const apiUrl = import.meta.env.VITE_API_URL + url;
                const headers: any = {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                };

                // Add authorization token if available
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const res = await axios.post(apiUrl, data, { headers });

                if (!res.data.status) {
                    setError(res.data.message);
                } else {
                    setLoading(false);
                    setError(null);
                    setResponse(res.data);
                }

                return res.data;
            } catch (err: any) {
                setError(err.response?.data?.message || 'An error occurred');
                setLoading(false);
            } finally {
                setLoading(false);
            }
        },
        [url, token]
    );

    return { postData, loading, error, response };
};

export default usePost;
