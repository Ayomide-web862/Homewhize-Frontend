import api from "./axios";

export const getAllBookings = (status = "paid", limit = 500, offset = 0) =>
  api.get("/bookings", { params: { status, limit, offset } });

export const createBooking = (payload) => api.post("/bookings", payload);

export const getBookingById = (id) => api.get(`/bookings/${id}`);

export const settleBooking = (id) => api.post(`/bookings/${id}/settle`);

export default {
  getAllBookings,
  createBooking,
  getBookingById,
  settleBooking,
};
