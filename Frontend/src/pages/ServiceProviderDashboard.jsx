import React from "react";
import {
  FiInbox,
  FiClock,
  FiCheckCircle,
  FiMessageCircle,
  FiPlus,
  FiCalendar,
  FiDollarSign,
  FiStar,
} from "react-icons/fi";
import "./ServiceProviderDashboard.css";
import ServiceProviderLayout from "../components/ServiceProviderLayout";

/* Modern Stat Card */
function StatCard({ icon, title, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon-wrapper" style={{ background: color }}>
        {icon}
      </div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
}

export default function ServiceProviderDashboard() {
  return (
    <ServiceProviderLayout>
      <div className="dashboard-home">

        {/* ===== PAGE HEADER ===== */}
        <div className="dashboard-header">
          <h1>Dashboard Overview</h1>
          <p>Welcome back — here’s what’s happening today</p>
        </div>

        {/* ===== TOP STATS ===== */}
        <div className="stats-grid">
          <StatCard
            icon={<FiInbox />}
            title="New Requests"
            value="8"
            color="linear-gradient(135deg, #6CC1FF, #3A8DFF)"
          />
          <StatCard
            icon={<FiClock />}
            title="Active Jobs"
            value="5"
            color="linear-gradient(135deg, #FFA69E, #FF6B6B)"
          />
          <StatCard
            icon={<FiCheckCircle />}
            title="Completed Jobs"
            value="42"
            color="linear-gradient(135deg, #6BE585, #33C86B)"
          />
          <StatCard
            icon={<FiMessageCircle />}
            title="Unread Messages"
            value="3"
            color="linear-gradient(135deg, #FBC2EB, #A18CD1)"
          />
        </div>

        {/* ===== DASHBOARD WIDGETS ===== */}
        <div className="dashboard-widgets">

          {/* QUICK ACTIONS */}
          <div className="widget quick-actions">
            <h2>Quick Actions</h2>

            <div className="actions-grid">
              <button><FiPlus /> Add Service</button>
              <button><FiCalendar /> Bookings</button>
              <button><FiMessageCircle /> Messages</button>
              <button>₦ Earnings</button>
            </div>
          </div>

          {/* PERFORMANCE */}
          <div className="widget performance">
            <h2>Performance</h2>

            <div className="performance-stats">
              <div>
                <FiCalendar />
                <span>12 Jobs This Week</span>
              </div>

              <div>
                <FiStar />
                <span>4.9 Rating</span>
              </div>

              <div>
                <FiDollarSign />
                <span>₦240,000 Earned</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </ServiceProviderLayout>
  );
}