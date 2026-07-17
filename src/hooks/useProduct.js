import { useState, useEffect } from 'react';
import { getProductById } from '../api/products';

export function useProduct(id) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Si no viene un ID válido, no hacemos la petición
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const product = await getProductById(id);
                setData(product);
            } catch (err) {
                setError('Error al cargar el detalle del producto');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]); // Dependencia [id]: si el usuario pasa a otro producto, el efecto se vuelve a ejecutar

    return { data, loading, error };
}