import axios from 'axios';

// Vite lee automáticamente el archivo .env si estás en local, o las variables de entorno en producción
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true, // <-- Imprescindible para que el navegador envíe y reciba las cookies httpOnly
});

// Ya no necesitamos el interceptor de request para inyectar el token manualmente,
// porque la cookie viaja sola gracias a 'withCredentials: true'.

export default api;