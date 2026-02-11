import api from './axios';

export const initializePayment = (payload) => api.post('/payments/initialize', payload);
export const verifyPayment = (reference) => api.get(`/payments/verify/${encodeURIComponent(reference)}`);

export default { initializePayment, verifyPayment };
