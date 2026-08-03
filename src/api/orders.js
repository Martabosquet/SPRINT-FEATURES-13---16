import apiClient from './axios';

export async function checkoutOrder(shippingAddress) {
  const response = await apiClient.post('/api/orders', { shippingAddress });
  return response.data;
}