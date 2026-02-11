import React from "react";
import "./Super-AdminSidebar.css";
import { NavLink } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

import {
  FaHome,
  FaBuilding,
  FaIdCard,
  FaChartLine,
  FaMoneyCheckAlt,
  FaChartBar,
  FaUsersCog,
  FaUsers,
  FaCog,
} from "react-icons/fa";

export default function SuperAdminSidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}
      >
        {/* Header */}
        <div className="sidebar-header">
          <h2 className="admin-logo">HomeWhize</h2>
        </div>

        <nav>
          <NavLink to="/super-admin/dashboard" end>
            <FaHome /> <span>Dashboard</span>
          </NavLink>

          {/* <NavLink to="/super-admin/bookings">
            <FaBuilding /> <span>Bookings</span>
          </NavLink> */}

          <NavLink to="/super-admin/kyc">
            <FaIdCard /> <span>Owners KYC</span>
          </NavLink>

          {/* <NavLink to="/super-admin/revenueanalytics">
            <FaChartLine /> <span>Revenue Analytics</span>
          </NavLink> */}

          {/* <NavLink to="/admin/payouts">
            <FaMoneyCheckAlt /> <span>Payments</span>
          </NavLink> */}

          {/* <NavLink to="/admin/reports">
            <FaChartBar /> <span>Reports</span>
          </NavLink> */}

          <NavLink to="/super-admin/userspage">
            <FaUsersCog /> <span>Users</span>
          </NavLink>

          <NavLink to="/super-admin/community">
            <FaUsers /> <span>Community</span>
          </NavLink>

          <NavLink to="/super-admin/settings-page">
            <FaCog /> <span>Settings</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
