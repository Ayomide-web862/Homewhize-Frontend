import React from "react";
import "./ServiceProviderSidebar.css";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaCogs,
  FaComments,
  FaIdCard
} from "react-icons/fa";

export default function ServiceProviderSidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="sp-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sp-sidebar ${sidebarOpen ? "open" : ""}`}>
        
        {/* LOGO */}
        <div className="sp-sidebar-header">
          <h2 className="sp-logo">HomeWhize</h2>
        </div>

        {/* NAVIGATION */}
        <nav onClick={() => setSidebarOpen(false)}>

          <NavLink
            to="/service-provider/dashboard"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaHome /> <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/service-provider/booking-requests"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaBook /> <span>Booking Requests</span>
          </NavLink>

          <NavLink
            to="/service-provider/service-management"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaCogs /> <span>Service Management</span>
          </NavLink>

          <NavLink
            to="/service-provider/messages"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaComments /> <span>Messages</span>
          </NavLink>

          <NavLink
            to="/service-provider/kyc"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaIdCard /> <span>KYC</span>
          </NavLink>

          <NavLink
            to="/service-provider/settings"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaCogs /> <span>Settings</span>
          </NavLink>

        </nav>
      </aside>
    </>
  );
}