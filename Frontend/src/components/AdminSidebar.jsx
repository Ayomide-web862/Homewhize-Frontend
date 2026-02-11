import React from "react";
import "./AdminSidebar.css";
import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaBuilding,
  FaClipboardList,
  FaIdCard,
  FaChartPie,
  FaCalendarCheck,
  FaUserCog,
} from "react-icons/fa";


export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <aside tabIndex="-1" aria-hidden={!sidebarOpen} className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
      <h2 className="admin-logo">HomeWhize</h2>

      <nav onClick={() => setSidebarOpen(false)}>
        <NavLink
          to="/admin/dashboard"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaHome /> Dashboard
        </NavLink>

        <NavLink
          to="/admin/properties"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaBuilding /> My Properties
        </NavLink>

        {/* <NavLink
          to="/admin/bookings"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaClipboardList /> Bookings
        </NavLink> */}

        <NavLink
          to="/admin/kyc"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaIdCard /> KYC
        </NavLink>

        {/* <NavLink
          to="/admin/revenue"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaChartPie /> Revenue & Earnings
        </NavLink> */}

        {/* <NavLink
          to="/admin/availability-manager"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaCalendarCheck /> Availability Manager
        </NavLink> */}

        <NavLink
          to="/admin/settingspage"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaUserCog /> Profile Settings
        </NavLink>
      </nav>
    </aside>
  );
}
