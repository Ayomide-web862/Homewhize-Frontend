import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { getProviderBySlug } from "../api/providers.api";
import { createServiceBooking } from "../api/serviceBookings.api";
import "./ServiceBookingForm.css";

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  alternate_phone: "",
  service_date: "",
  service_time: "",
  address: "",
  notes: "",
  property_type: "",
  room_count: "",
  urgency_level: "",
};

const validateEmail = (value) => {
  if (!value.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? "" : "Please enter a valid email";
};

const validatePhone = (value) => {
  if (!value.trim()) return "Phone number is required";
  const digits = value.replace(/[^0-9]/g, "");
  return digits.length >= 10 ? "" : "Please enter a valid phone number";
};

const validateDate = (value) => {
  if (!value) return "Service date is required";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(value);
  return selected < today ? "Date cannot be in the past" : "";
};

const validateTime = (value) => (value ? "" : "Service time is required");

const validateAddress = (value) => (value.trim() ? "" : "Service address is required");

export default function ServiceBookingForm() {
  const { slug, serviceId } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const providerData = await getProviderBySlug(slug);
        setProvider(providerData);
        const selectedService = (providerData.services || []).find((item) => String(item.id) === String(serviceId));
        setService(selectedService || null);
      } catch (err) {
        setStatusMessage({ type: "error", text: "Unable to load provider details." });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, serviceId]);

  const validateForm = () => {
    const nextErrors = {
      full_name: formData.full_name.trim() ? "" : "Full name is required",
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      service_date: validateDate(formData.service_date),
      service_time: validateTime(formData.service_time),
      address: validateAddress(formData.address),
    };
    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setStatusMessage({ type: "error", text: "Please fix the highlighted fields." });
      return;
    }

    if (!service) {
      setStatusMessage({ type: "error", text: "Selected service is not available." });
      return;
    }

    setSubmitting(true);
    try {
      await createServiceBooking({
        service_id: service.id,
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        alternate_phone: formData.alternate_phone.trim() || null,
        service_date: formData.service_date,
        service_time: formData.service_time,
        address: formData.address.trim(),
        notes: formData.notes.trim() || null,
        property_type: formData.property_type.trim() || null,
        room_count: formData.room_count ? Number(formData.room_count) : null,
        urgency_level: formData.urgency_level.trim() || null,
        amount: service.price || 0,
        currency: "NGN",
      });
      setStatusMessage({ type: "success", text: "Booking request sent. The provider will respond shortly." });
      setTimeout(() => navigate("/service-bookings"), 1800);
    } catch (err) {
      setStatusMessage({ type: "error", text: err.response?.data?.message || "Unable to submit booking request" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="service-booking-page">
        <Navbar />
        <div className="service-booking-loading">Loading booking details...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="service-booking-page">
        <Navbar />
        <div className="service-booking-error">
          <p>Selected service could not be loaded.</p>
          <button className="secondary-btn" onClick={() => navigate(-1)}>Back to provider</button>
        </div>
      </div>
    );
  }

  return (
    <div className="service-booking-page">
      <Navbar />
      <div className="service-booking-container">
        <button className="back-link" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to provider
        </button>

        <div className="service-booking-grid">
          <div className="service-booking-details-card">
            <h1>Book Service</h1>
            <p className="provider-name">{provider.company_name || provider.provider_name}</p>
            <div className="service-summary-card">
              <h2>{service.title}</h2>
              <p>{service.category || "Service"}</p>
              <div className="service-summary-meta">
                <span>Price</span>
                <strong>₦{Number(service.price || 0).toLocaleString()}</strong>
              </div>
              <div className="service-summary-meta">
                <span>Duration</span>
                <strong>{service.estimatedDuration || "N/A"}</strong>
              </div>
            </div>
          </div>

          <div className="service-booking-form-card">
            <h2>Booking details</h2>
            {statusMessage && (
              <div className={`message ${statusMessage.type}`}>{statusMessage.text}</div>
            )}
            <div className="form-grid">
              <label>
                Full name
                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={errors.full_name ? "input-error" : ""}
                />
                {errors.full_name && <span className="field-error">{errors.full_name}</span>}
              </label>
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </label>
              <label>
                Phone number
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "input-error" : ""}
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </label>
              <label>
                Alternate contact (optional)
                <input
                  name="alternate_phone"
                  value={formData.alternate_phone}
                  onChange={handleChange}
                />
              </label>
              <label>
                Service date
                <input
                  type="date"
                  name="service_date"
                  value={formData.service_date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  className={errors.service_date ? "input-error" : ""}
                />
                {errors.service_date && <span className="field-error">{errors.service_date}</span>}
              </label>
              <label>
                Service time
                <input
                  type="time"
                  name="service_time"
                  value={formData.service_time}
                  onChange={handleChange}
                  className={errors.service_time ? "input-error" : ""}
                />
                {errors.service_time && <span className="field-error">{errors.service_time}</span>}
              </label>
              <label className="full-width">
                Service address
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? "input-error" : ""}
                />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </label>
              <label className="full-width">
                Notes / instructions
                <textarea
                  name="notes"
                  rows="4"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </label>
              <label>
                Number of rooms
                <input
                  name="room_count"
                  type="number"
                  min="0"
                  value={formData.room_count}
                  onChange={handleChange}
                />
              </label>
              <label>
                Property type
                <input
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                />
              </label>
              <label className="full-width">
                Urgency level
                <select name="urgency_level" value={formData.urgency_level} onChange={handleChange}>
                  <option value="">Select urgency</option>
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                  <option value="Same day">Emergency</option>
                </select>
              </label>
            </div>

            <div className="booking-summary">
              <div>
                <span>Service</span>
                <strong>{service.title}</strong>
              </div>
              <div>
                <span>Price</span>
                <strong>₦{Number(service.price || 0).toLocaleString()}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>Pending provider approval</strong>
              </div>
            </div>

            <button className="primary-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Sending request..." : "Submit booking request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
