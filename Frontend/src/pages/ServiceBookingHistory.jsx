import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiClock, FiDollarSign, FiMapPin, FiMessageCircle } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { getMyServiceBookings, initializeServiceBookingPayment, cancelServiceBooking } from "../api/serviceBookings.api";
import "./ServiceBookingHistory.css";

export default function ServiceBookingHistory() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyServiceBookings();
        setBookings(res.data.bookings || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load bookings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePayNow = async (bookingId) => {
    try {
      setProcessing(bookingId);
      const res = await initializeServiceBookingPayment(bookingId);
      const { authorization_url } = res.data;
      if (authorization_url) {
        window.location.href = authorization_url;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to initialize payment");
    } finally {
      setProcessing(null);
    }
  };

  const handleCancel = async (id) => {
    try {
      setProcessing(id);
      await cancelServiceBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, booking_status: "cancelled" } : b)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to cancel booking");
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status) => {
    return status.replace(/_/g, " ");
  };

  return (
    <div className="service-booking-history-page">
      <Navbar />
      <div className="service-booking-history-shell">
        <button className="history-back" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        <div className="history-header">
          <h1>My Service Bookings</h1>
          <p>Track requests, payments, and provider responses in one place.</p>
        </div>

        {loading ? (
          <div className="history-loading">Loading your bookings...</div>
        ) : error ? (
          <div className="history-error">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="history-empty">
            <h2>No service bookings found</h2>
            <p>Book a cleaning or lifestyle service to see it here.</p>
          </div>
        ) : (
          <div className="history-grid">
            {bookings.map((booking) => (
              <div className="history-card" key={booking.id}>
                <div className="history-card-head">
                  <div>
                    <h2>{booking.service_title}</h2>
                    <p>{booking.provider_name}</p>
                  </div>
                  <span className={`status-badge ${booking.booking_status}`}>{getStatusBadge(booking.booking_status)}</span>
                </div>

                <div className="history-info">
                  <div>
                    <FiMapPin /> {booking.address}
                  </div>
                  <div>
                    <FiClock /> {booking.service_date || "N/A"} {booking.service_time || ""}
                  </div>
                  <div>
                    <FiDollarSign /> ₦{Number(booking.amount || 0).toLocaleString()}
                  </div>
                </div>

                <div className="history-meta">
                  <span>Payment: {booking.payment_status}</span>
                  <span>Ref: {booking.booking_reference}</span>
                </div>

                <div className="history-actions">
                  <button onClick={() => navigate(`/service-bookings/${booking.id}`)}>View Details</button>
                  {booking.payment_status === "awaiting_payment" && booking.booking_status !== "cancelled" && (
                    <button
                      className="primary-action"
                      onClick={() => handlePayNow(booking.id)}
                      disabled={processing === booking.id}
                    >
                      {processing === booking.id ? "Opening payment..." : "Pay Now"}
                    </button>
                  )}
                  <button
                    className="secondary-action"
                    onClick={() => navigate(`/provider/${booking.provider_slug}`)}
                  >
                    <FiMessageCircle /> Chat Provider
                  </button>
                  {['pending', 'accepted', 'awaiting_payment'].includes(booking.booking_status) && (
                    <button
                      className="cancel-action"
                      onClick={() => handleCancel(booking.id)}
                      disabled={processing === booking.id}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
