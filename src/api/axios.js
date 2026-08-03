import axios from 'axios';

// Vite lee automáticamente el archivo .env si estás en local, o las variables de entorno en producción
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true, // Imprescindible para que el navegador envíe y reciba las cookies httpOnly
});

// Interceptor de respuesta para detectar cuando la cookie ha caducado o no hay autorización (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Como estabas usando cookies httpOnly, si guardabas algo auxiliar como el userName en localStorage, lo limpiamos:
      localStorage.removeItem('userName');

      // Lanzamos un evento personalizado para que el Header y otros componentes detecten que la sesión se cerró
      window.dispatchEvent(new Event('authChange'));

      // Redirigimos al usuario al login si no está ya en él
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;