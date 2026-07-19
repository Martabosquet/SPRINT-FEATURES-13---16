import { useState, useEffect } from 'react';
import { getProductById } from '../api/products';
import axios from 'axios';

export function useProduct(id) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Si no viene un ID válido, no hacemos la petición
        if (!id) {
            setData(null);
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
                const product = await getProductById(id, { signal: controller.signal });
                if (isMounted) {
                    setData(product);
                }
            } catch (err) {
                if (isMounted && !axios.isCancel(err)) {
                    setError('Error al cargar el detalle del producto');
                    setData(null);
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
    }, [id]); // Dependencia [id]: si el usuario pasa a otro producto, el efecto se vuelve a ejecutar

    return { data, loading, error };
}