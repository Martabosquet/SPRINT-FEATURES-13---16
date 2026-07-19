import { useState, useEffect } from 'react';
import { getReviews } from '../api/reviews';
import axios from 'axios';

export function useReviews(productId) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productId) {
            setData([]);
            setLoading(false);
            setError(null);
            return;
        }

        let isMounted = true;
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const reviews = await getReviews(productId, { signal: controller.signal });
                if (isMounted) {
                    setData(reviews);
                }
            } catch (err) {
                if (isMounted && !axios.isCancel(err)) {
                    setError('Error al cargar las valoraciones');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [productId]); // Se vuelve a ejecutar si cambia el producto visualizado

    return { data, loading, error };
}