import api from './axios';

// Obtiene todos los productos del servidor
export const getProducts = async (config = {}) => {
    const response = await api.get('/api/products', config); // Añadimos /api/
    return response.data.data; // Primer .data es de Axios, el segundo .data es el array de tu backend
};

// Obtiene un único producto buscando por su ID
export const getProductById = async (id, config = {}) => {
    const response = await api.get(`/api/products/${id}`, config); // Añadimos /api/
    return response.data.data; // Retorna el objeto del producto contenido en el JSON de tu backend
};