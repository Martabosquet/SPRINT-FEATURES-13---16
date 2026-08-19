import apiClient from './axios';

// Crea el pedido a partir del carrito activo. Recibe los campos de la dirección "planos" (street, city, postalCode, country) y los envuelve
// en shippingAddress, tal y como lo espera order.controller.js
export async function checkoutOrder(shippingAddress) {
  const response = await apiClient.post('/api/orders', { shippingAddress });
  return response.data;
}

// Historial de pedidos del usuario
export async function getUserOrders() {
  const response = await apiClient.get('/api/orders');
  return response.data;
}

export async function getOrderByPaymentIntent(paymentIntentId) {
  const response = await apiClient.get(`/api/orders/by-payment-intent/${paymentIntentId}`);
  return response.data;
}

// Rutas exclusivas de administración
export async function getAllOrdersAdmin() {
  const response = await apiClient.get('/api/admin/orders');
  return response.data;
}

export async function updateOrderStatusAdmin(orderId, status) {
  const response = await apiClient.patch(`/api/admin/orders/${orderId}/status`, { status });
  return response.data;
}