import axios from 'axios';

// Vite lee automáticamente el archivo .env si estás en local, o las variables de Render si estás en internet
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Interceptor para inyectar el token JWT en cada petición (preparado para registrar y logear usuarios)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;