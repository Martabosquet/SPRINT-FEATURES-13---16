import api from './axios';

export const getProducts = async (config = {}) => {
    const response = await api.get('/api/products', config);
    return response.data.data;
};

export const getProductById = async (id, config = {}) => {
    const response = await api.get(`/api/products/${id}`, config);
    return response.data.data;
};

export const createProduct = async (productData, config = {}) => {
    const response = await api.post('/api/products', productData, config);
    return response.data.data;
};

// Actualiza un producto existente. productData debe ser un FormData
// (igual que en createProduct) para poder incluir una nueva imagen opcional.
export const updateProduct = async (id, productData) => {
    const response = await api.put(`/api/products/${id}`, productData);
    return response.data.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
};