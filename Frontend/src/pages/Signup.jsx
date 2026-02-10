import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./Auth.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const password = formData.password;
  const rules = {
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@#$%^&*]/.test(password),
    length: password.length >= 8,
  };

  const isValid = Object.values(rules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return setMessage("Password does not meet requirements");
    if (formData.password !== formData.confirmPassword)
      return setMessage("Passwords do not match");

    try {
      setLoading(true);
      const res = await api.post("/auth/signup", formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (res) => {
    try {
      setLoading(true);
      const decoded = jwtDecode(res.credential);
      const result = await api.post("/auth/google", { token: res.credential });

      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      window.location.href = "/";
    } catch {
      setMessage("Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* LOGO */}
        <div className="auth-logo">
          <img src="/Homewhize.png" alt="HomeWhize Logo" />
        </div>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtext">Join the luxury experience</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="text" name="name" onChange={handleChange} placeholder="Full Name" className="auth-input" required />
          <input type="email" name="email" onChange={handleChange} placeholder="Email" className="auth-input" required />

          <div className="auth-password-wrapper">
            <input type={showPassword ? "text" : "password"} name="password" onChange={handleChange} placeholder="Password" className="auth-input" />
            <span className="auth-eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <div className="auth-password-wrapper">
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" onChange={handleChange} placeholder="Confirm Password" className="auth-input" />
            <span className="auth-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button className="auth-btn" disabled={!isValid || loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-divider">OR</p>

        <GoogleLogin onSuccess={handleGoogleSuccess} />

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}
