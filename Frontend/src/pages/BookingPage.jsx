import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import "./BookingPage.css";

export default function BookingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const shortlet = state?.shortlet;
  
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    check_in: "",
    check_out: "",
    guests: 1
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation helper functions
  const validateFullName = (name) => {
    if (!name || name.trim().length === 0) return "Full name is required";
    if (name.trim().length < 2) return "Full name must be at least 2 characters";
    if (name.trim().length > 100) return "Full name must be less than 100 characters";
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return "Full name can only contain letters, spaces, hyphens, and apostrophes";
    return "";
  };

  const validateEmail = (email) => {
    if (!email || email.trim().length === 0) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone || phone.trim().length === 0) return "Phone number is required";
    const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\d{10,}$/;
    if (!phoneRegex.test(phone.replace(/[-.\s]/g, ""))) return "Please enter a valid phone number";
    return "";
  };

  const validateCheckIn = (checkIn) => {
    if (!checkIn) return "Check-in date is required";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDate = new Date(checkIn);
    if (checkInDate < today) return "Check-in date cannot be in the past";
    return "";
  };

  const validateCheckOut = (checkOut, checkIn) => {
    if (!checkOut) return "Check-out date is required";
    if (!checkIn) return "Please select check-in date first";
    const checkOutDate = new Date(checkOut);
    const checkInDate = new Date(checkIn);
    if (checkOutDate <= checkInDate) return "Check-out must be after check-in";
    return "";
  };

  const validateGuests = (guests) => {
    const numGuests = Number(guests);
    if (!guests || numGuests < 1) return "Guests must be at least 1";
    const maxGuests = Number(shortlet.max_guests || 1);
    if (numGuests > maxGuests) return `Maximum ${maxGuests} guests allowed`;
    return "";
  };

  const validateAllFields = () => {
    const newErrors = {
      full_name: validateFullName(formData.full_name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      check_in: validateCheckIn(formData.check_in),
      check_out: validateCheckOut(formData.check_out, formData.check_in),
      guests: validateGuests(formData.guests),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err !== "");
  };

  const showModal = (title, message, type = "info") => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

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

  

  const nights =
    formData.check_in && formData.check_out
      ? Math.ceil(
          (new Date(formData.check_out) - new Date(formData.check_in)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const cautionFee = Number(shortlet.caution_fee || shortlet.cautionFee || 0);
  const roomTotal = nights * Number(shortlet.price || 0);
  const total = roomTotal + cautionFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTouched({ ...touched, [name]: true });

    // Real-time validation
    let error = "";
    switch (name) {
      case "full_name":
        error = validateFullName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "check_in":
        error = validateCheckIn(value);
        break;
      case "check_out":
        error = validateCheckOut(value, formData.check_in);
        break;
      case "guests":
        error = validateGuests(value);
        break;
      default:
        break;
    }
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async () => {
    // Validate all fields first
    if (!validateAllFields()) {
      return showModal(
        "Validation Error",
        "Please fix all errors before proceeding.",
        "error"
      );
    }

    if (!formData.check_in || !formData.check_out) {
      return showModal("Invalid dates", "Please choose both check-in and check-out dates.", "error");
    }
    if (nights <= 0) {
      return showModal("Invalid range", "Check-out must be after check-in.", "error");
    }

    try {
      const api = (await import("../api/axios")).default;

      // Check availability with backend endpoint first
      try {
        const { data: avail } = await api.get(`/properties/${shortlet.id}/availability`, {
          params: {
            check_in: formData.check_in,
            check_out: formData.check_out,
          },
        });

        if (!avail.available) {
          const blockedDates = (avail.booked_dates || []).join(", ");
          return showModal(
            "Dates unavailable",
            `Selected dates are already booked. Blocked dates: ${blockedDates}`,
            "error"
          );
        }
      } catch (checkErr) {
        console.warn("Availability check failed", checkErr);
        return showModal("Error", "Could not verify availability, please try again.", "error");
      }

      const payload = {
        ...formData,
        property_id: shortlet.id,
        price_per_night: shortlet.price,
        caution_fee: cautionFee,
        total_amount: total,
      };

      // Initialize booking payment (creates booking only on successful payment)
      const initRes = await api.post("/payments/initialize-booking", payload);

      const { authorization_url, booking_reference } = initRes.data;
      if (!authorization_url) {
        showModal("Error", "Failed to initialize payment. Try again.", "error");
        return;
      }

      // Store booking reference for verification page
      localStorage.setItem('pending_booking_ref', booking_reference);

      // Redirect user to Paystack payment page
      window.location.href = authorization_url;
    } catch (err) {
      showModal("Error", err.response?.data?.message || "Payment initialization failed", "error");
    }
  };

  return (
    <div className="booking-container">
      <Modal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={closeModal}
      />
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
            <div className="form-group">
              <input
                name="full_name"
                placeholder="Full Name"
                onChange={handleChange}
                className={errors.full_name && touched.full_name ? "input-error" : ""}
              />
              {errors.full_name && touched.full_name && (
                <span className="error-message">{errors.full_name}</span>
              )}
            </div>

            <div className="form-group">
              <input
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                className={errors.email && touched.email ? "input-error" : ""}
              />
              {errors.email && touched.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <input
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                className={errors.phone && touched.phone ? "input-error" : ""}
              />
              {errors.phone && touched.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
            </div>

            <div className="date-row">
              <div className="form-group">
                <label>Check-in</label>
                <input
                  type="date"
                  name="check_in"
                  onChange={handleChange}
                  className={errors.check_in && touched.check_in ? "input-error" : ""}
                />
                {errors.check_in && touched.check_in && (
                  <span className="error-message">{errors.check_in}</span>
                )}
              </div>

              <div className="form-group">
                <label>Check-out</label>
                <input
                  type="date"
                  name="check_out"
                  onChange={handleChange}
                  className={errors.check_out && touched.check_out ? "input-error" : ""}
                />
                {errors.check_out && touched.check_out && (
                  <span className="error-message">{errors.check_out}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <input
                type="number"
                name="guests"
                min="1"
                max={Number(shortlet.max_guests || 1)}
                placeholder="Number of Guests"
                onChange={handleChange}
                className={errors.guests && touched.guests ? "input-error" : ""}
              />
              {errors.guests && touched.guests && (
                <span className="error-message">{errors.guests}</span>
              )}
            </div>
          </div>

          <div className="booking-summary">
            <div>
              <span>Nights</span>
              <strong>{nights}</strong>
            </div>

            <div>
              <span>Room Total</span>
              <strong>₦{roomTotal.toLocaleString()}</strong>
            </div>

            <div>
              <span>Caution Fee</span>
              <strong>₦{cautionFee.toLocaleString()}</strong>
            </div>

            <div>
              <span>Total</span>
              <strong>₦{total.toLocaleString()}</strong>
            </div>
          </div>

          <button className="booking-btn" onClick={handleSubmit} disabled={Object.values(errors).some((err) => err !== "")}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
