import apiClient from './axios';

export async function checkoutOrder(orderData) {
  const response = await apiClient.post('/api/orders', orderData);
  return response.data;
}