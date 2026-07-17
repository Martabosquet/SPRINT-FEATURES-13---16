import { useState, useEffect } from 'react';
import { getReviews } from '../api/reviews';

export function useReviews(productId) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const reviews = await getReviews(productId);
                setData(reviews);
            } catch (err) {
                setError('Error al cargar las valoraciones');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId]); // Se vuelve a ejecutar si cambia el producto visualizado

    return { data, loading, error };
}