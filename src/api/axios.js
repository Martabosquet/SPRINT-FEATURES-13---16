import axios from 'axios';
import { clearSession, notifyAuthChange } from '../utils/authStorage';

// Vite lee automáticamente el archivo .env si estás en local, o las variables de entorno en producción
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true, // Imprescindible para que el navegador envíe y reciba las cookies httpOnly
});

const handleSessionExpired = () => {
  clearSession();
  notifyAuthChange();

  if (!window.location.pathname.includes('/login')) {
    window.location.replace('/login?expired=true');
  }
};

// Interceptor de respuesta para detectar cuando la cookie ha caducado o no hay autorización (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      handleSessionExpired();
    }
    return Promise.reject(error);
  }
);

export default api;