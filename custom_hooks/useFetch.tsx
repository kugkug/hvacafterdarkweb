import { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../utilities/auth';

const useFetch = (url: string, body: any = null, enabled: boolean = true) => {
    const { token } = useAuth();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(!!enabled);
    const [error, setIsError] = useState<string | null>(null);

    const refetch = useCallback(() => {
        if (!enabled) return;
        setIsLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL + url;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        axios
            .get(apiUrl, {
                params: body,
                headers
            })
            .then((res) => {
                setData(res.data);
                console.log(res.data);
            })
            .catch((err) =>
                setIsError(err.response?.data?.message || 'An error occurred')
            )
            .finally(() => setIsLoading(false));
    }, [url, token, enabled]);

    useEffect(() => {
        if (!enabled) {
            setIsLoading(false);
            return;
        }

        setData(null);
        setIsError(null);
        setIsLoading(true);

        try {
            console.log(token);
            const apiUrl = import.meta.env.VITE_API_URL + url;
            const headers: any = {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            axios
                .get(apiUrl, { headers })
                .then((res) => {
                    console.log(res.data);
                    setData(res.data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err.response?.data?.message);
                    setIsError(
                        err.response?.data?.message || 'An error occurred'
                    );
                    setIsLoading(false);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } catch (err: any) {
            setIsError(err.response?.data?.message || 'An error occurred');
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }, [url, token, enabled]);

    return { data, isLoading, error, refetch };
};

export default useFetch;
