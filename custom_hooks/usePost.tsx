import { useCallback, useState } from 'react';
import axios from 'axios';

const usePost = (url: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<any>(null);

    const postData = useCallback(
        async (data: object) => {
            setLoading(true);
            setError(null);

            try {
                const apiUrl = import.meta.env.VITE_API_URL + url;
                const res = await axios.post(apiUrl, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    }
                });

                if (!res.data.status) {
                    setError(res.data.message);
                } else {
                    setLoading(false);
                    setError(null);
                    setResponse(res.data);
                }

                return res.data;
            } catch (err: any) {
                setError(err.response.data.message);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        },
        [url]
    );

    return { postData, loading, error, response };
};

export default usePost;
