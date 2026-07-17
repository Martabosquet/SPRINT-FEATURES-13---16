import api from './axios';

// Envía las credenciales del usuario para iniciar sesión
export const login = async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
};

// Envía los datos del nuevo usuario para registrarlo en el sistema
export const register = async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
};