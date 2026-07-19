import api from './axios';

// Obtiene las reviews de un producto específico
export const getReviews = async (productId, config = {}) => {
    const response = await api.get(`/api/products/${productId}/reviews`, config); //lo conecto a la ruta del back-end
    return response.data.data; // Extrae el array de reviews del JSON del backend
};