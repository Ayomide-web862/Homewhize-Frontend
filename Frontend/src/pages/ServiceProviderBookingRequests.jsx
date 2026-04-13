import React, { useEffect, useMemo, useState } from "react";
import {
  FiCheck,
  FiX,
  FiCheckCircle,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiClock,
  FiRefreshCw,
  FiClipboard,
  FiBriefcase,
} from "react-icons/fi";
import "./ServiceProviderBookingRequests.css";
import ServiceProviderLayout from "../components/ServiceProviderLayout";

import {
  getProviderServiceBookings,
  acceptServiceBooking,
  rejectServiceBooking,
  markBookingInProgress,
  markBookingCompleted,
} from "../api/serviceBookings.api";

const statusOptions = [
  "all",
  "pending",
  "accepted",
  "awaiting_payment",
  "confirmed",
  "in_progress",
  "completed",
  "rejected",
  "cancelled",
];

export default function ServiceProviderBookingRequests() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const res = await getProviderServiceBookings();
        setBookings(res.data.bookings || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load bookings");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const refreshBookings = async () => {
    try {
      const res = await getProviderServiceBookings();
      setBookings(res.data.bookings || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to refresh bookings");
    }
  };

  const handleAction = async (id, action) => {
    setProcessing(id);
    try {
      if (action === "accept") await acceptServiceBooking(id);
      if (action === "reject") await rejectServiceBooking(id);
      if (action === "in_progress") await markBookingInProgress(id);
      if (action === "completed") await markBookingCompleted(id);
      await refreshBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    } finally {
      setProcessing(null);
    }
  };

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.booking_status === filter);

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.booking_status === "pending").length;
    const active = bookings.filter((b) =>
      ["accepted", "confirmed", "in_progress"].includes(b.booking_status)
    ).length;
    const completed = bookings.filter((b) => b.booking_status === "completed").length;

    return { total, pending, active, completed };
  }, [bookings]);

  const formatStatusLabel = (status) => status.replace(/_/g, " ");

  return (
    <ServiceProviderLayout>
      <div className="sp-bookings-page">
        <div className="sp-bookings-topbar">
          <div className="sp-bookings-heading-wrap">
            {/* <span className="sp-bookings-eyebrow">Service provider dashboard</span> */}
            <h1>Booking Requests</h1>
            <p>
              Manage incoming service bookings, track job progress, and respond
              to customers from one place.
            </p>
          </div>

          {/* <button className="sp-refresh-btn" onClick={refreshBookings} type="button">
            <FiRefreshCw />
            Refresh
          </button> */}
        </div>

        <div className="sp-bookings-stats">
          <div className="sp-stat-card">
            <span className="sp-stat-label">Total bookings</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="sp-stat-card">
            <span className="sp-stat-label">Pending</span>
            <strong>{stats.pending}</strong>
          </div>
          <div className="sp-stat-card">
            <span className="sp-stat-label">Active jobs</span>
            <strong>{stats.active}</strong>
          </div>
          <div className="sp-stat-card">
            <span className="sp-stat-label">Completed</span>
            <strong>{stats.completed}</strong>
          </div>
        </div>

        <div className="sp-filter-row">
          {statusOptions.map((status) => (
            <button
              key={status}
              className={filter === status ? "filter-btn active" : "filter-btn"}
              onClick={() => setFilter(status)}
              type="button"
            >
              {formatStatusLabel(status)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="sp-state-card sp-loading">Loading booking requests...</div>
        ) : error ? (
          <div className="sp-state-card sp-error">{error}</div>
        ) : filteredBookings.length === 0 ? (
          <div className="sp-state-card sp-empty">No matching booking requests found.</div>
        ) : (
          <div className="sp-bookings-grid">
            {filteredBookings.map((booking) => (
              <div className="sp-booking-card" key={booking.id}>
                <div className="sp-booking-card-glow" />

                <div className="sp-booking-header">
                  <div className="sp-booking-user">
                    <div className="sp-booking-avatar">
                      <FiUser />
                    </div>

                    <div className="sp-booking-user-text">
                      <h3>{booking.user_name || booking.user_email || booking.user}</h3>
                      <span className="sp-booking-meta-inline">
                        <FiBriefcase />
                        Service booking
                      </span>
                    </div>
                  </div>

                  <span className={`status ${booking.booking_status}`}>
                    {formatStatusLabel(booking.booking_status)}
                  </span>
                </div>

                <div className="sp-booking-body">
                  <div className="sp-booking-detail">
                    <span className="sp-detail-icon">
                      <FiMapPin />
                    </span>
                    <div>
                      <small>Location</small>
                      <p>{booking.address || "N/A"}</p>
                    </div>
                  </div>

                  <div className="sp-booking-detail">
                    <span className="sp-detail-icon">
                      <FiCalendar />
                    </span>
                    <div>
                      <small>Service date</small>
                      <p>{booking.service_date || booking.date || "N/A"}</p>
                    </div>
                  </div>

                  <div className="sp-booking-detail">
                    <span className="sp-detail-icon">
                      <FiClock />
                    </span>
                    <div>
                      <small>Service time</small>
                      <p>{booking.service_time || booking.time || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="sp-booking-notes">
                  <div className="sp-booking-notes-title">
                    <FiClipboard />
                    <span>Notes</span>
                  </div>
                  <p>{booking.notes || "No notes provided."}</p>
                </div>

                <div className="sp-booking-actions">
                  {booking.booking_status === "pending" && (
                    <>
                      <button
                        className="action-btn accept-btn"
                        disabled={processing === booking.id}
                        onClick={() => handleAction(booking.id, "accept")}
                        type="button"
                      >
                        <FiCheck />
                        {processing === booking.id ? "Processing..." : "Accept"}
                      </button>

                      <button
                        className="action-btn reject-btn"
                        disabled={processing === booking.id}
                        onClick={() => handleAction(booking.id, "reject")}
                        type="button"
                      >
                        <FiX />
                        {processing === booking.id ? "Processing..." : "Reject"}
                      </button>
                    </>
                  )}

                  {booking.booking_status === "confirmed" &&
                    booking.payment_status === "paid" && (
                      <button
                        className="action-btn progress-btn"
                        disabled={processing === booking.id}
                        onClick={() => handleAction(booking.id, "in_progress")}
                        type="button"
                      >
                        <FiCheckCircle />
                        {processing === booking.id
                          ? "Processing..."
                          : "Mark In Progress"}
                      </button>
                    )}

                  {booking.booking_status === "in_progress" && (
                    <button
                      className="action-btn complete-btn"
                      disabled={processing === booking.id}
                      onClick={() => handleAction(booking.id, "completed")}
                      type="button"
                    >
                      <FiCheckCircle />
                      {processing === booking.id
                        ? "Processing..."
                        : "Mark Completed"}
                    </button>
                  )}

                  {booking.booking_status === "completed" && (
                    <div className="completed-label">
                      <FiCheckCircle />
                      Job Completed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ServiceProviderLayout>
  );
}