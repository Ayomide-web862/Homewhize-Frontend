import api from "./axios";

export const createServiceBooking = (payload) => api.post("/service-bookings", payload);
export const getMyServiceBookings = () => api.get("/service-bookings/my");
export const getServiceBookingById = (id) => api.get(`/service-bookings/${id}`);
export const getProviderServiceBookings = () => api.get("/service-bookings/provider");
export const acceptServiceBooking = (id, note = null) => api.post(`/service-bookings/${id}/accept`, { note });
export const rejectServiceBooking = (id, note = null) => api.post(`/service-bookings/${id}/reject`, { note });
export const cancelServiceBooking = (id) => api.post(`/service-bookings/${id}/cancel`);
export const markBookingInProgress = (id) => api.post(`/service-bookings/${id}/in-progress`);
export const markBookingCompleted = (id) => api.post(`/service-bookings/${id}/complete`);
export const initializeServiceBookingPayment = (id) => api.post(`/service-bookings/${id}/pay`);
export const getProviderDashboardStats = () => api.get("/service-bookings/provider/stats");

export default {
  createServiceBooking,
  getMyServiceBookings,
  getServiceBookingById,
  getProviderServiceBookings,
  acceptServiceBooking,
  rejectServiceBooking,
  cancelServiceBooking,
  markBookingInProgress,
  markBookingCompleted,
  initializeServiceBookingPayment,
  getProviderDashboardStats,
};