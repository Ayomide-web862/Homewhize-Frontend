import React, { useState } from "react";
import {
  FiCheck,
  FiX,
  FiCheckCircle,
  FiMapPin,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import "./ServiceProviderBookingRequests.css";
import ServiceProviderLayout from "../components/ServiceProviderLayout";

export default function ServiceProviderBookingRequests() {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      user: "John Doe",
      address: "12 Ring Road, Ibadan",
      date: "20 Feb 2026",
      time: "10:00 AM",
      notes: "Please focus on kitchen and bathrooms.",
      status: "pending",
    },
    {
      id: 2,
      user: "Jane Smith",
      address: "Bodija, Ibadan",
      date: "22 Feb 2026",
      time: "2:00 PM",
      notes: "Deep cleaning required.",
      status: "accepted",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setBookings(
      bookings.map((b) =>
        b.id === id ? { ...b, status: newStatus } : b
      )
    );
  };

  return (
    <ServiceProviderLayout>
    <div className="sp-bookings-page">
      <h1>Service Provider — Booking Requests</h1>

      <div className="sp-bookings-grid">
        {bookings.map((booking) => (
          <div className="sp-booking-card" key={booking.id}>
            <div className="sp-booking-header">
              <h3>
                <FiUser /> {booking.user}
              </h3>
              <span className={`status ${booking.status}`}>
                {booking.status}
              </span>
            </div>

            <p>
              <FiMapPin /> {booking.address}
            </p>

            <p>
              <FiCalendar /> {booking.date} — {booking.time}
            </p>

            <p className="notes">📝 {booking.notes}</p>

            <div className="sp-booking-actions">
              {booking.status === "pending" && (
                <>
                  <button
                    className="accept-btn"
                    onClick={() =>
                      updateStatus(booking.id, "accepted")
                    }
                  >
                    <FiCheck /> Accept
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() =>
                      updateStatus(booking.id, "rejected")
                    }
                  >
                    <FiX /> Reject
                  </button>
                </>
              )}

              {booking.status === "accepted" && (
                <button
                  className="complete-btn"
                  onClick={() =>
                    updateStatus(booking.id, "completed")
                  }
                >
                  <FiCheckCircle /> Mark Completed
                </button>
              )}

              {booking.status === "completed" && (
                <div className="completed-label">
                  Job Completed
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </ServiceProviderLayout>
  );
}