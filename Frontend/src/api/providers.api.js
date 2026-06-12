import api from "./axios";

export const getProviderBySlug = async (slug) => {
  const res = await api.get(`/providers/slug/${encodeURIComponent(slug)}`);
  if (!res.data) throw new Error('Provider not found');
  return res.data;
};

export const getProvider = async (id) => {
  const res = await api.get(`/providers/${id}`);
  return res.data;
};

export const getProviders = async (category = null) => {
  const qs = category ? `?category=${encodeURIComponent(category)}` : '';
  const res = await api.get(`/providers${qs}`);
  return res.data.providers || [];
};

export const createProvider = async (payload) => {
  const res = await api.post('/providers', payload);
  return res.data;
};

export const createService = async (providerId, payload, files = null) => {
  let data = payload;
  let headers = {};

  if (files && files.length > 0) {
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (payload[key] !== null && payload[key] !== undefined) {
        formData.append(key, payload[key]);
      }
    });
    files.forEach((file, index) => {
      formData.append('images', file);
    });
    data = formData;
    headers['Content-Type'] = 'multipart/form-data';
  }

  const res = await api.post(`/providers/${providerId}/services`, data, { headers });
  return res.data.service;
};

export const getMyProvider = async () => {
  const res = await api.get('/providers/me');
  return res.data.provider;
};

export const deleteService = async (providerId, serviceId) => {
  const res = await api.delete(`/providers/${providerId}/services/${serviceId}`);
  return res.data;
};

export const deleteProvider = async (id) => {
  const res = await api.delete(`/providers/${id}`);
  return res.data;
};

export default { getProviderBySlug, getProvider, getProviders, createProvider };