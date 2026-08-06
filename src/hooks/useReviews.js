import { useState, useEffect, useCallback } from 'react';
import { getReviews } from '../api/reviews';
import axios from 'axios';

export function useReviews(productId) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchReviews = useCallback(async () => {
        if (!productId) {
            setData([]);
            setLoading(false);
            setError(null);
            return;
        }
        const controller = new AbortController();

        try {
            setLoading(true);
            setError(null);
            const reviews = await getReviews(
                productId,
                {
                    signal: controller.signal
                }
            );
            setData(reviews);
        } catch (err) {

            if (!axios.isCancel(err)) {
                setError(
                    'Error al cargar las valoraciones'
                );
            }
        } finally {
            setLoading(false);
        }
        return () => {
            controller.abort();
        };
    }, [productId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    return {
        data,
        loading,
        error,
        refreshReviews: fetchReviews
    };
}