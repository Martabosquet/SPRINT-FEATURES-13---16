import api from './axios';

// Envía las credenciales del usuario para iniciar sesión
export const login = async (credentials) => {
    const response = await api.post('/api/login', credentials);
    return response.data;
};

// Envía los datos del nuevo usuario para registrarlo en el sistema
export const register = async (userData) => {
    const response = await api.post('/api/register', userData);
    return response.data;
};

// Obtiene los datos del perfil actual
export const getProfile = async () => {
    const response = await api.get('/api/me');
    return response.data;
};

// Actualiza datos y/o foto de perfil (envía FormData)
export const updateProfile = async (formData) => {
    const response = await api.put('/api/me', formData);
    return response.data;
};

// Cambia la contraseña
export const updatePassword = async (passwordData) => {
    const response = await api.put('/api/me/password', passwordData);
    return response.data;
};

// Elimina la cuenta del usuario actual
export const deleteAccount = async () => {
    const response = await api.delete('/api/me');
    return response.data;
};