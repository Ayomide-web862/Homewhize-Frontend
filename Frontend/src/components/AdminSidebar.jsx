import React from "react";
import "./AdminSidebar.css";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaClipboardList,
  FaIdCard,
  FaUserCog,
} from "react-icons/fa";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const handleNavClick = () => {
    if (window.innerWidth <= 767) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside
      tabIndex={sidebarOpen ? "0" : "-1"}
      aria-hidden={!sidebarOpen}
      className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}
    >
      <div className="admin-sidebar-inner">
        <h2 className="admin-logo">HomeWhize</h2>

        <nav className="admin-nav" onClick={handleNavClick}>
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaHome className="admin-nav-icon" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/properties"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaBuilding className="admin-nav-icon" />
            <span>My Properties</span>
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaClipboardList className="admin-nav-icon" />
            <span>Bookings</span>
          </NavLink>

          <NavLink
            to="/admin/kyc"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaIdCard className="admin-nav-icon" />
            <span>KYC</span>
          </NavLink>

          <NavLink
            to="/admin/settingspage"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaUserCog className="admin-nav-icon" />
            <span>Profile Settings</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}