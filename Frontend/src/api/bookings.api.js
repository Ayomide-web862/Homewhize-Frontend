import api from "./axios";

export const getAllBookings = (status = "paid", limit = 500, offset = 0) =>
  api.get("/bookings", { params: { status, limit, offset } });

export const getBookingsForSettlement = (status = "awaiting_review", limit = 50, offset = 0) =>
  api.get("/bookings/settlement", { params: { status, limit, offset } });

export const createBooking = (payload) => api.post("/bookings", payload);

export const getBookingById = (id) => api.get(`/bookings/${id}`);

export const approveOwnerPayout = (id, reviewNote) =>
  api.post(`/bookings/${id}/approve-payout`, { review_note: reviewNote });

export const refundCautionFee = (id, reviewNote) =>
  api.post(`/bookings/${id}/refund-caution-fee`, { review_note: reviewNote });

export const releaseCautionFeeToOwner = (id, reviewNote) =>
  api.post(`/bookings/${id}/release-caution-fee`, { review_note: reviewNote });

export const cancelBooking = (id) => api.post(`/bookings/${id}/cancel`);

export default {
  getAllBookings,
  getBookingsForSettlement,
  createBooking,
  getBookingById,
  approveOwnerPayout,
  refundCautionFee,
  releaseCautionFeeToOwner,
  cancelBooking,
};
