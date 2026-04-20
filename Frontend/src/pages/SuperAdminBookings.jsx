import React, { useState, useEffect } from "react";
import SuperAdminLayout from "../components/Super-AdminLayout";
import { getAllBookings } from "../api/bookings.api";
import "./SuperAdminBookings.css";

export default function SuperAdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("paid");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllBookings(statusFilter, 1000, 0);
      setBookings(response.data.bookings || []);
      setStats(response.data.stats || {});
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.full_name?.toLowerCase().includes(searchLower) ||
      booking.property_name?.toLowerCase().includes(searchLower) ||
      booking.admin_name?.toLowerCase().includes(searchLower) ||
      booking.booking_reference?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₦0";
    return `₦${Number(amount).toLocaleString()}`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "status-paid";
      case "pending":
        return "status-pending";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="bookings-page">
          <div className="loading-spinner">Loading bookings...</div>
        </div>
      </SuperAdminLayout>
    );
  }

  if (error) {
    return (
      <SuperAdminLayout>
        <div className="bookings-page">
          <div className="error-message">{error}</div>
          <button onClick={fetchBookings} className="retry-btn">Retry</button>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="bookings-page">

        {/* PAGE TITLE */}
        <div className="bookings-header">
          <h2>All Bookings</h2>
          <button className="export-btn">Export CSV</button>
        </div>

        {/* STATS CARDS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.total_bookings || 0}</h3>
            <p>Total Bookings</p>
          </div>
          <div className="stat-card">
            <h3>{stats.paid_bookings || 0}</h3>
            <p>Paid Bookings</p>
          </div>
          <div className="stat-card">
            <h3>{stats.pending_bookings || 0}</h3>
            <p>Pending Bookings</p>
          </div>
          <div className="stat-card">
            <h3>{formatCurrency(stats.total_revenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="filter-bar">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            type="text"
            placeholder="Search by guest, property, admin, or booking ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button className="filter-btn" onClick={fetchBookings}>Refresh</button>
        </div>

        {/* BOOKINGS TABLE */}
        <div className="table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Guest</th>
                <th>Property</th>
                <th>Admin</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Nights</th>
                <th>Guests</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="11" className="no-data">
                    {searchTerm ? "No bookings match your search." : "No bookings found."}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td data-label="Booking Ref">{booking.booking_reference || "N/A"}</td>
                    <td data-label="Guest">
                      <div className="guest-info">
                        <strong>{booking.full_name || "N/A"}</strong>
                        <small>{booking.email || ""}</small>
                        <small>{booking.phone || ""}</small>
                      </div>
                    </td>
                    <td data-label="Property">
                      <div className="property-info">
                        <strong>{booking.property_name || "N/A"}</strong>
                        <small>{booking.property_location || ""}</small>
                      </div>
                    </td>
                    <td data-label="Admin">
                      <div className="admin-info">
                        <strong>{booking.admin_name || "N/A"}</strong>
                        <small>{booking.admin_email || ""}</small>
                      </div>
                    </td>
                    <td data-label="Check-in">{formatDate(booking.check_in)}</td>
                    <td data-label="Check-out">{formatDate(booking.check_out)}</td>
                    <td data-label="Nights">{booking.nights || 0}</td>
                    <td data-label="Guests">{booking.guests || 0}</td>
                    <td data-label="Amount">{formatCurrency(booking.total_amount)}</td>
                    <td data-label="Status">
                      <span className={`status-badge ${getStatusBadgeClass(booking.payment_status)}`}>
                        {booking.payment_status || "Unknown"}
                      </span>
                    </td>
                    <td data-label="Created">{formatDate(booking.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

      </div>
    </SuperAdminLayout>
  );
}
