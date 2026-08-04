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

// Crea un nuevo producto en el backend
export const createProduct = async (productData, config = {}) => {
    const response = await api.post('/api/products', productData, config);
    return response.data.data;
};

// elimina un producto por su ID
export const deleteProduct = async (id) => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
};