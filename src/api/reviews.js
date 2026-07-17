import api from './axios';

// Obtiene los comentarios asociados a un identificador de producto específico
export const getReviews = async (productId) => {
    const response = await api.get(`/reviews?productId=${productId}`);
    return response.data; // Retorna el array de reviews
};