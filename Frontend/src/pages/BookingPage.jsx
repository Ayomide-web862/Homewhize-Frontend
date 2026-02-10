import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";
import "./BookingPage.css";

export default function BookingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const shortlet = state?.shortlet;

  if (!shortlet) {
    return (
      <>
        <Navbar />
        <p style={{ padding: "2rem", textAlign: "center" }}>
          Booking data not found.
        </p>
      </>
    );
  }

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    check_in: "",
    check_out: "",
    guests: 1
  });

  const nights =
    formData.check_in && formData.check_out
      ? Math.ceil(
          (new Date(formData.check_out) - new Date(formData.check_in)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const total = nights * shortlet.price;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const api = (await import("../api/axios")).default;
      const payload = {
        ...formData,
        property_id: shortlet.id,
        price_per_night: shortlet.price,
      };
      const { data } = await api.post("/bookings", payload);
      alert(`Booking Created! Ref: ${data.booking_reference}`);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-content">
        <Navbar />

        {/* Back Navigation */}
        <button className="booking-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to details
        </button>

        <div className="booking-card">
          <h2 className="booking-title">
            Book <span>{shortlet.name}</span>
          </h2>

          <p className="booking-location">
            {shortlet.address}, {shortlet.location}
          </p>

          <div className="booking-form">
            <input
              name="full_name"
              placeholder="Full Name"
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
            />

            <div className="date-row">
              <div>
                <label>Check-in</label>
                <input type="date" name="check_in" onChange={handleChange} />
              </div>

              <div>
                <label>Check-out</label>
                <input type="date" name="check_out" onChange={handleChange} />
              </div>
            </div>

            <input
              type="number"
              name="guests"
              min="1"
              placeholder="Number of Guests"
              onChange={handleChange}
            />
          </div>

          <div className="booking-summary">
            <div>
              <span>Nights</span>
              <strong>{nights}</strong>
            </div>

            <div>
              <span>Total</span>
              <strong>₦{total.toLocaleString()}</strong>
            </div>
          </div>

          <button className="booking-btn" onClick={handleSubmit}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
