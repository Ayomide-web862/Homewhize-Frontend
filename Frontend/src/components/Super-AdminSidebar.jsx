import React from "react";
import "./Super-AdminSidebar.css";
import { NavLink } from "react-router-dom";

import { 
  FaHome, 
  FaBuilding, 
  FaIdCard, 
  FaChartLine, 
  FaMoneyCheckAlt, 
  FaChartBar, 
  FaUsersCog,
  FaUsers,
  FaCog
} from "react-icons/fa";

export default function SuperAdminSidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <aside tabIndex="-1" aria-hidden={!sidebarOpen} className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
      <h2 className="admin-logo">HomeWhize</h2>

      <nav onClick={() => setSidebarOpen && setSidebarOpen(false)}>
        <NavLink to="/super-admin/dashboard" end>
          <FaHome /> Dashboard
        </NavLink>

        <NavLink to="/super-admin/bookings">
          <FaBuilding /> Bookings
        </NavLink>

        <NavLink to="/super-admin/kyc">
          <FaIdCard /> Owners KYC
        </NavLink>

        <NavLink to="/super-admin/revenueanalytics">
          <FaChartLine /> Revenue Analytics
        </NavLink>

        <NavLink to="/admin/payouts">
          <FaMoneyCheckAlt /> Payments
        </NavLink>

        <NavLink to="/admin/reports">
          <FaChartBar /> Reports
        </NavLink>

        <NavLink to="/super-admin/userspage">
          <FaUsersCog /> Users
        </NavLink>

        {/* NEW COMMUNITY PAGE */}
        <NavLink to="/super-admin/community">
          <FaUsers /> Community
        </NavLink>

        <NavLink to="/super-admin/settings-page">
          <FaCog /> Settings
        </NavLink>
      </nav>
    </aside>
  );
}
