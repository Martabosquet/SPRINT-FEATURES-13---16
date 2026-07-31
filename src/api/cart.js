import apiClient from './axios';

export async function getCart() {
  const response = await apiClient.get('/api/cart');  //para ir en línea con las rutas del back-end
  return response.data.data; // Aquí debe venir el array de ítems del carrito
}

// Añadir más cantidad de un producto (o incrementar)
export async function addCartItem(productId, quantity = 1) {
  const response = await apiClient.post('/api/cart/items', { productId, quantity });
  return response.data.data;
}

export async function removeItem(productId) {
  // Asegúrate de que la ruta coincida con el endpoint de tu backend: DELETE /api/cart/items/:itemId
  const response = await apiClient.delete(`/api/cart/items/${productId}`);
  return response.data;
}

// Disminuir la cantidad de un ítem
export async function decreaseItemQuantity(cartItemId, quantity) {
  // Ajusta la ruta si en tu backend es PUT o PATCH, pero usa el cartItemId en la URL
  const response = await apiClient.patch(`/api/cart/items/${cartItemId}`, { quantity });
  return response.data;
}