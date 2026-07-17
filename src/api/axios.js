import axios from 'axios';

// Vite lee automáticamente el archivo .env si estás en local, o las variables de Render si estás en internet
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

export default api;