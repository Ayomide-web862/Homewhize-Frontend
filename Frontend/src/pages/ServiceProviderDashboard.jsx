import React, { useState, useEffect } from "react";
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
import { getProviderDashboardStats } from "../api/serviceBookings.api";

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
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingRequests: 0,
    activeJobs: 0,
    completedJobs: 0,
    unreadMessages: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getProviderDashboardStats();
        setStats(response.data.stats);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <ServiceProviderLayout>
        <div className="dashboard-home">
          <div className="dashboard-header">
            <h1>Dashboard Overview</h1>
            <p>Loading...</p>
          </div>
        </div>
      </ServiceProviderLayout>
    );
  }

  if (error) {
    return (
      <ServiceProviderLayout>
        <div className="dashboard-home">
          <div className="dashboard-header">
            <h1>Dashboard Overview</h1>
            <p>Error: {error}</p>
          </div>
        </div>
      </ServiceProviderLayout>
    );
  }
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
            value={stats.pendingRequests}
            color="linear-gradient(135deg, #6CC1FF, #3A8DFF)"
          />
          <StatCard
            icon={<FiClock />}
            title="Active Jobs"
            value={stats.activeJobs}
            color="linear-gradient(135deg, #FFA69E, #FF6B6B)"
          />
          <StatCard
            icon={<FiCheckCircle />}
            title="Completed Jobs"
            value={stats.completedJobs}
            color="linear-gradient(135deg, #6BE585, #33C86B)"
          />
          <StatCard
            icon={<FiMessageCircle />}
            title="Unread Messages"
            value={stats.unreadMessages}
            color="linear-gradient(135deg, #0F4D3C, #1A6F54)"
          />
        </div>

        {/* ===== DASHBOARD WIDGETS ===== */}
        <div className="dashboard-widgets">

          {/* QUICK ACTIONS */}
          {/* <div className="widget quick-actions">
            <h2>Quick Actions</h2>

            <div className="actions-grid">
              <button><FiPlus /> Add Service</button>
              <button><FiCalendar /> Bookings</button>
              <button><FiMessageCircle /> Messages</button>
              <button>₦ Earnings</button>
            </div>
          </div> */}

          {/* PERFORMANCE */}
          {/* <div className="widget performance">
            <h2>Performance</h2>

            <div className="performance-stats">
              <div>
                <FiCalendar />
                <span>{stats.completedJobs} Jobs Completed</span>
              </div>

              <div>
                <FiStar />
                <span>4.9 Rating</span>
              </div>

              <div>
                <FiDollarSign />
                <span>₦{stats.totalEarnings.toLocaleString()} Earned</span>
              </div>
            </div>
          </div> */}

        </div>
      </div>
    </ServiceProviderLayout>
  );
}