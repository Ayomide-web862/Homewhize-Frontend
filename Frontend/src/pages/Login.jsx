import React, { useState } from "react";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setMessage("Google credential missing. Please try again.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const res = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if (role === "superadmin") window.location.href = "/super-admin/dashboard";
      else if (role === "admin") window.location.href = "/admin/dashboard";
      else if (role === "cleaner") window.location.href = "/service-provider/dashboard";
      else window.location.href = "/";
    } catch (error) {
      console.error("Google login error:", error);
      setMessage(error.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setMessage("Google Sign-In failed. Try again.");
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;
      if (role === "superadmin") window.location.href = "/super-admin/dashboard";
      else if (role === "admin") window.location.href = "/admin/dashboard";
      else if (role === "cleaner") window.location.href = "/service-provider/dashboard";
      else window.location.href = "/";
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-logo">
            <img src="/Homewhize.png" alt="HomeWhize Logo" />
          </div>

          <span className="auth-badge">Welcome Back</span>

          <h2 className="auth-title">Log in to your account</h2>
          <p className="auth-subtext">
            Access your bookings, properties, and personalized HomeWhize experience.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <FiMail />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <FiLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="auth-input auth-input-password"
                  required
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="auth-row">
              <button
                type="button"
                className="auth-forgot"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            <button className="auth-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {message && <p className="auth-message error">{message}</p>}

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="auth-google-wrap">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
            />
          </div>

          <p className="auth-link-text">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}