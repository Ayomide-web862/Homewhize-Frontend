import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import "./AdminSettingsPage.css";
import { FiUser, FiLock, FiBell, FiSliders } from "react-icons/fi";

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@chuttlers.com",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmNew: "",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    dashboardUpdates: true,
  });

  const [systemPrefs, setSystemPrefs] = useState({
    darkMode: false,
    autoLogout: true,
  });

  return (
    <AdminLayout>
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>

      {/* PROFILE SETTINGS */}
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

          <button className="save-btn">Save Changes</button>
        </div>
      </div>

      {/* PASSWORD SETTINGS */}
      <div className="settings-card">
        <h3 className="section-title">
          <FiLock /> Change Password
        </h3>

        <div className="settings-grid">
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={passwords.newPass}
              onChange={(e) =>
                setPasswords({ ...passwords, newPass: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirmNew}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmNew: e.target.value })
              }
            />
          </div>

          <button className="save-btn">Update Password</button>
        </div>
      </div>

      {/* NOTIFICATION PREFERENCES */}
      <div className="settings-card">
        <h3 className="section-title">
          <FiBell /> Notification Preferences
        </h3>

        <div className="toggle-group">
          <label>
            <input
              type="checkbox"
              checked={notifications.emailAlerts}
              onChange={() =>
                setNotifications({
                  ...notifications,
                  emailAlerts: !notifications.emailAlerts,
                })
              }
            />
            Email Alerts
          </label>

          <label>
            <input
              type="checkbox"
              checked={notifications.smsAlerts}
              onChange={() =>
                setNotifications({
                  ...notifications,
                  smsAlerts: !notifications.smsAlerts,
                })
              }
            />
            SMS Alerts
          </label>

          <label>
            <input
              type="checkbox"
              checked={notifications.dashboardUpdates}
              onChange={() =>
                setNotifications({
                  ...notifications,
                  dashboardUpdates: !notifications.dashboardUpdates,
                })
              }
            />
            Dashboard Updates
          </label>
        </div>
      </div>

      {/* SYSTEM PREFERENCES */}
      <div className="settings-card">
        <h3 className="section-title">
          <FiSliders /> System Preferences
        </h3>

        <div className="toggle-group">
          <label>
            <input
              type="checkbox"
              checked={systemPrefs.darkMode}
              onChange={() =>
                setSystemPrefs({
                  ...systemPrefs,
                  darkMode: !systemPrefs.darkMode,
                })
              }
            />
            Enable Dark Mode
          </label>

          <label>
            <input
              type="checkbox"
              checked={systemPrefs.autoLogout}
              onChange={() =>
                setSystemPrefs({
                  ...systemPrefs,
                  autoLogout: !systemPrefs.autoLogout,
                })
              }
            />
            Auto Logout After Inactivity
          </label>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}