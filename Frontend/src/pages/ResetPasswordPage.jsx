import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import api from "../api/axios";
import "./ForgotPasswordAuth.css";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get reset token and email from location state or localStorage
    const token = location.state?.resetToken || localStorage.getItem("resetToken");
    const mail = location.state?.email || localStorage.getItem("resetEmail");

    if (!token || !mail) {
      setError("Invalid reset session. Please start over.");
      setTimeout(() => navigate("/forgot-password"), 3000);
      return;
    }

    setResetToken(token);
    setEmail(mail);
  }, [location, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validation
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/password/reset-password", {
        email,
        resetToken,
        newPassword,
      });

      setMessage(res.data.message);
      // Clear localStorage
      localStorage.removeItem("resetToken");
      localStorage.removeItem("resetEmail");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        {/* Back Button */}
        <button
          className="reset-password-back-btn"
          onClick={() => navigate("/forgot-password")}
        >
          <FiArrowLeft /> Back
        </button>

        {/* Logo */}
        <div className="reset-password-logo">
          <div className="reset-password-logo-bg">H</div>
          <span className="reset-password-logo-text">HomeWhize</span>
        </div>

        {/* Title */}
        <h2 className="reset-password-title">Create New Password</h2>
        <p className="reset-password-subtext">
          Enter your new password below to reset your account.
        </p>

        {/* Message */}
        {message && <div className="reset-password-success">{message}</div>}
        {error && <div className="reset-password-error">{error}</div>}

        {/* Form */}
        <form className="reset-password-form" onSubmit={handleResetPassword}>
          {/* New Password */}
          <div className="reset-password-field">
            <label className="reset-password-label">New Password</label>
            <div className="reset-password-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="reset-password-input"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="reset-password-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <small className="reset-password-hint">
              Minimum 8 characters required
            </small>
          </div>

          {/* Confirm Password */}
          <div className="reset-password-field">
            <label className="reset-password-label">Confirm Password</label>
            <div className="reset-password-password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="reset-password-input"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="reset-password-eye"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="reset-password-btn"
            disabled={loading}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        {/* Footer */}
        <p className="reset-password-footer">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="reset-password-link"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
