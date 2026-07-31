import apiClient from './axios';

export async function getWishlist() {
  const response = await apiClient.get('/wishlist');
  return response.data.data;
}

export async function toggleWishlist(productId) {
  const response = await apiClient.post('/wishlist/toggle', { productId });
  return response.data.data;
}