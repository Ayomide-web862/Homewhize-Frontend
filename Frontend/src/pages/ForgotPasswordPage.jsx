import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import api from "../api/axios";
import "./ForgotPasswordAuth.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState("");
  const [otpLoading, setOTPLoading] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/password/request-otp", { email });
      setMessage(res.data.message);
      setShowOTPInput(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setOTPLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/password/verify-otp", {
        email,
        otp,
      });
      // Navigate to reset password page with resetToken
      localStorage.setItem("resetToken", res.data.resetToken);
      localStorage.setItem("resetEmail", email);
      navigate("/reset-password", { state: { email, resetToken: res.data.resetToken } });
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setOTPLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        {/* Back Button */}
        <button
          className="forgot-password-back-btn"
          onClick={() => navigate("/login")}
        >
          <FiArrowLeft /> Back
        </button>

        {/* Logo */}
        <div className="forgot-password-logo">
          <div className="forgot-password-logo-bg">H</div>
          <span className="forgot-password-logo-text">HomeWhize</span>
        </div>

        {/* Title */}
        <h2 className="forgot-password-title">Forgot Password?</h2>
        <p className="forgot-password-subtext">
          {showOTPInput
            ? "We've sent an OTP to your email. Enter it below."
            : "Enter your email address and we'll send you an OTP to reset your password."}
        </p>

        {/* Message */}
        {message && <div className="forgot-password-success">{message}</div>}
        {error && <div className="forgot-password-error">{error}</div>}

        {/* Form */}
        {!showOTPInput ? (
          <form className="forgot-password-form" onSubmit={handleRequestOTP}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="forgot-password-input"
              required
              disabled={loading}
            />
            <button
              type="submit"
              className="forgot-password-btn"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form className="forgot-password-form" onSubmit={handleVerifyOTP}>
            <p className="forgot-password-email-display">
              OTP sent to <strong>{email}</strong>
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOTP(e.target.value.slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="forgot-password-input"
              maxLength="6"
              required
              disabled={otpLoading}
            />
            <p className="forgot-password-otp-timer">
              Valid for <strong>1 minute</strong>
            </p>
            <button
              type="submit"
              className="forgot-password-btn"
              disabled={otpLoading}
            >
              {otpLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* Back to Login Link */}
        <p className="forgot-password-footer">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="forgot-password-link"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
