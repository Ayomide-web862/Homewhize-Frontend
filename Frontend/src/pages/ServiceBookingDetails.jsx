import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiCalendar, FiClock, FiMapPin, FiMessageCircle, FiTag, FiUser, FiDollarSign } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { getServiceBookingById, acceptServiceBooking, rejectServiceBooking, markBookingInProgress, markBookingCompleted, cancelServiceBooking, initializeServiceBookingPayment } from "../api/serviceBookings.api";
import { getUser } from "../utils/auth";
import "./ServiceBookingDetails.css";

const formatDate = (value) => {
  if (!value) return "N/A";
  try {
    return new Date(value).toLocaleDateString();
  } catch (e) {
    return value;
  }
};

export default function ServiceBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getServiceBookingById(id);
        setBooking(res.data.booking);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load booking details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAction = async (action) => {
    if (!booking) return;
    setProcessing(true);
    setMessage(null);

    try {
      if (action === "accept") await acceptServiceBooking(booking.id);
      if (action === "reject") await rejectServiceBooking(booking.id);
      if (action === "in_progress") await markBookingInProgress(booking.id);
      if (action === "complete") await markBookingCompleted(booking.id);
      if (action === "cancel") await cancelServiceBooking(booking.id);
      if (action === "pay") {
        const res = await initializeServiceBookingPayment(booking.id);
        window.location.href = res.data.authorization_url;
        return;
      }
      const refreshed = await getServiceBookingById(id);
      setBooking(refreshed.data.booking);
      setMessage({ type: "success", text: "Booking updated successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Action failed" });
    } finally {
      setProcessing(false);
    }
  };

  const isProviderOwner = user && user.role === "cleaner" && booking?.provider_slug;
  const isBookingOwner = user && booking?.user_email && user.email === booking.user_email;

  return (
    <div className="service-booking-details-page">
      <Navbar />
      <div className="details-shell">
        <button className="details-back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        {loading ? (
          <div className="details-loading">Loading booking details...</div>
        ) : error ? (
          <div className="details-error">{error}</div>
        ) : booking ? (
          <div className="details-card">
            <div className="details-header">
              <div>
                <h1>Booking #{booking.booking_reference}</h1>
                <p>{booking.provider_name}</p>
              </div>
              <span className={`status ${booking.booking_status}`}>{booking.booking_status.replace(/_/g, " ")}</span>
            </div>

            <div className="details-grid">
              <div className="details-box">
                <h3>Service</h3>
                <p><FiTag /> {booking.service_title}</p>
                <p><FiDollarSign /> ₦{Number(booking.amount || 0).toLocaleString()}</p>
                <p><FiClock /> {booking.service_estimated_duration || "N/A"}</p>
                <p><FiCalendar /> {formatDate(booking.service_date)} {booking.service_time}</p>
              </div>

              <div className="details-box">
                <h3>Customer</h3>
                <p><FiUser /> {booking.full_name}</p>
                <p>Email: {booking.email}</p>
                <p>Phone: {booking.phone}</p>
                {booking.alternate_phone && <p>Alt: {booking.alternate_phone}</p>}
              </div>

              <div className="details-box">
                <h3>Location</h3>
                <p><FiMapPin /> {booking.address}</p>
                {booking.property_type && <p>Apartment type: {booking.property_type}</p>}
                {booking.room_count !== null && <p>Rooms: {booking.room_count}</p>}
                {booking.urgency_level && <p>Urgency: {booking.urgency_level}</p>}
              </div>
            </div>

            <div className="details-notes">
              <h3>Notes</h3>
              <p>{booking.notes || "No special instructions provided."}</p>
            </div>

            <div className="details-meta">
              <div>
                <strong>Payment status</strong>
                <span>{booking.payment_status}</span>
              </div>
              <div>
                <strong>Provider note</strong>
                <span>{booking.provider_response_note || "Not provided"}</span>
              </div>
            </div>

            {message && (
              <div className={`details-message ${message.type}`}>{message.text}</div>
            )}

            <div className="details-actions">
              {isBookingOwner && booking.payment_status === "awaiting_payment" && booking.booking_status !== "cancelled" && (
                <button disabled={processing} onClick={() => handleAction("pay")}>
                  {processing ? "Redirecting..." : "Pay Now"}
                </button>
              )}

              {isBookingOwner && ['pending', 'accepted', 'awaiting_payment'].includes(booking.booking_status) && (
                <button className="cancel" disabled={processing} onClick={() => handleAction("cancel")}>
                  Cancel Booking
                </button>
              )}

              {isProviderOwner && booking.booking_status === "pending" && (
                <>
                  <button disabled={processing} onClick={() => handleAction("accept")}>
                    Accept
                  </button>
                  <button className="danger" disabled={processing} onClick={() => handleAction("reject")}>
                    Reject
                  </button>
                </>
              )}

              {isProviderOwner && booking.booking_status === "confirmed" && booking.payment_status === "paid" && (
                <button disabled={processing} onClick={() => handleAction("in_progress")}>Mark In Progress</button>
              )}

              {isProviderOwner && booking.booking_status === "in_progress" && (
                <button disabled={processing} onClick={() => handleAction("complete")}>Mark Completed</button>
              )}

              <button className="secondary" onClick={() => navigate(`/provider/${booking.provider_slug}`)}>
                <FiMessageCircle /> Chat Provider
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
