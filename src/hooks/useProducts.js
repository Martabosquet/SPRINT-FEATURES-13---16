import { useState, useEffect } from 'react';
import { getProducts } from '../api/products';

export function useProducts() {
    const [data, setData] = useState([]); // Importante: array vacío inicial
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const products = await getProducts();
                setData(products); // Aquí ya se guarda el array puro extraído en el paso anterior
            } catch (err) {
                setError('Error al cargar la lista de productos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
}