import { useState, useEffect } from 'react';
import { getProducts } from '../api/products';
import axios from 'axios';

export function useProducts() {
    const [data, setData] = useState([]); // Importante: array vacío inicial
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null); // Reseteamos errores previos
                const products = await getProducts({ signal: controller.signal });
                if (isMounted) {
                    setData(products); // Aquí ya se guarda el array puro extraído en el paso anterior
                }
            } catch (err) {
                if (isMounted && !axios.isCancel(err)) {
                    setError('Error al cargar la lista de productos');
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
    }, []);

    return { data, loading, error };
}