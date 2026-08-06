import api from './axios';

// Envía las credenciales del usuario para iniciar sesión
export const login = async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
};

// Envía los datos del nuevo usuario para registrarlo en el sistema
export const register = async (formData) => {
    const response = await api.post('/api/auth/register', formData);
    return response.data;
};

// Cierra la sesión del usuario en el backend (invalida la cookie httpOnly)
export const logout = async () => {
    const response = await api.post('/api/auth/logout');
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

//Actualizar perfil cinéfilo
export const updateCinephileProfile = async (data) => {
  return api.patch('/api/profile/cinephile', data);
};