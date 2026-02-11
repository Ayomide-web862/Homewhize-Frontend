import React, { useState } from "react";
import { getUser } from "../utils/auth";
import api from "../api/axios";
import {
  FiUser,
  FiLock,
  FiBell,
  FiSliders,
  FiEye,
  FiEyeOff
} from "react-icons/fi";
import "./SettingsBody.css";

export default function SettingsBody({ showAdvanced = true }) {
  const stored = getUser() || {};
  const [profile, setProfile] = useState({
    name: stored.name || "",
    email: stored.email || "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmNew: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    dashboardUpdates: true,
  });

  const [systemPrefs, setSystemPrefs] = useState({
    darkMode: false,
    autoLogout: true,
  });

  const handleChangePassword = async (e) => {
    e && e.preventDefault();
    setMessage("");

    if (passwords.newPass !== passwords.confirmNew)
      return setMessage("New passwords do not match");

    if (passwords.newPass.length < 8)
      return setMessage("New password must be at least 8 characters");

    setLoading(true);
    try {
      const res = await api.post("/auth/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });

      setMessage(res.data.message || "Password updated successfully");
      setPasswords({ current: "", newPass: "", confirmNew: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-wrapper">
      {/* PROFILE */}
      <div className="settings-card">
        <h3 className="section-title">
          <FiUser /> Profile Information
        </h3>

        <div className="settings-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>

          {/* <button className="primary-btn">Save Changes</button> */}
        </div>
      </div>

      {/* PASSWORD */}
      <div className="settings-card">
        <h3 className="section-title">
          <FiLock /> Change Password
        </h3>

        <div className="settings-grid">
          <div className="form-group">
            <label>Current Password</label>
            <div className="input-with-icon">
              <input
                type={showCurrent ? "text" : "password"}
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
              />
              <span
                className="eye-icon"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>New Password</label>
            <div className="input-with-icon">
              <input
                type={showNew ? "text" : "password"}
                value={passwords.newPass}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPass: e.target.value })
                }
              />
              <span
                className="eye-icon"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type={showNew ? "text" : "password"}
              value={passwords.confirmNew}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  confirmNew: e.target.value,
                })
              }
            />
          </div>

          <button
            className="primary-btn"
            onClick={handleChangePassword}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          {message && <p className="form-message">{message}</p>}
        </div>
      </div>

      {/* ADVANCED */}
      {/* {showAdvanced && (
        <>
          <div className="settings-card">
            <h3 className="section-title">
              <FiBell /> Notification Preferences
            </h3>

            <div className="toggle-group">
              <Toggle
                label="Email Alerts"
                checked={notifications.emailAlerts}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    emailAlerts: !notifications.emailAlerts,
                  })
                }
              />
              <Toggle
                label="SMS Alerts"
                checked={notifications.smsAlerts}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    smsAlerts: !notifications.smsAlerts,
                  })
                }
              />
            </div>
          </div>

          <div className="settings-card">
            <h3 className="section-title">
              <FiSliders /> System Preferences
            </h3>

            <div className="toggle-group">
              <Toggle
                label="Enable Dark Mode"
                checked={systemPrefs.darkMode}
                onChange={() =>
                  setSystemPrefs({
                    ...systemPrefs,
                    darkMode: !systemPrefs.darkMode,
                  })
                }
              />
              <Toggle
                label="Auto Logout"
                checked={systemPrefs.autoLogout}
                onChange={() =>
                  setSystemPrefs({
                    ...systemPrefs,
                    autoLogout: !systemPrefs.autoLogout,
                  })
                }
              />
            </div>
          </div>
        </>
      )} */}
    </div>
  );
}

/* Toggle Component */
function Toggle({ label, checked, onChange }) {
  return (
    <div className="toggle-item">
      <span>{label}</span>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider"></span>
      </label>
    </div>
  );
}
