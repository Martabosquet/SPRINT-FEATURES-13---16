import apiClient from './axios'; // Importamos tu instancia de Axios configurada con los interceptores de token

// Función para obtener la lista de deseos del usuario autenticado
export async function getWishlist() {
    try {
        // Hacemos la petición GET a la ruta exacta del backend con el prefijo /api/
        const response = await apiClient.get('/api/wishlist');
        return response.data.data; // Retornamos los datos obtenidos
    } catch (error) {
        console.error('Error al obtener la wishlist:', error);
        throw error;
    }
}

// Función para añadir un producto a la wishlist usando tu ruta POST /api/wishlist/:productId
export async function addToWishlist(productId) {
    try {
        // Enviamos el ID del producto por la URL como espera tu backend
        const response = await apiClient.post(`/api/wishlist/${productId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error al añadir a la wishlist:', error);
        throw error;
    }
}

// Función para eliminar un producto de la wishlist usando tu ruta DELETE /api/wishlist/:id
export async function removeFromWishlist(productId) {
  // Aseguramos que se envía el productId o id que le pasemos
  const response = await apiClient.delete(`/api/wishlist/${productId}`);
  return response.data;
}