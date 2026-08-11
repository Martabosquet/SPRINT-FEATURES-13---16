import apiClient from './axios';

export async function createPaymentIntent(shippingAddress) {
    const response = await apiClient.post('/api/checkout', { shippingAddress });
    return response.data; // { ok, data: { clientSecret } }
}