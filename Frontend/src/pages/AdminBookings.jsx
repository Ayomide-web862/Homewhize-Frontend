import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllBookings } from "../api/bookings.api.js";
import "./AdminBookings.css";

import {
  FaClipboardList,
  FaCalendarCheck,
  FaMoneyBill,
  FaPercent,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
} from "react-icons/fa";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("paid");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookings(statusFilter === "all" ? "all" : statusFilter);
      setBookings(response.data.bookings || []);
      setStats(response.data.stats);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId, bookingReference) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${bookingReference}? This action cannot be undone.`)) {
      return;
    }

    try {
      setCancelling(bookingId);
      const api = (await import("../api/axios")).default;
      await api.post(`/bookings/${bookingId}/cancel`);

      // Refresh bookings list
      await fetchBookings();
      alert(`Booking ${bookingReference} has been cancelled successfully.`);
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelling(null);
    }
  };

  // Search and filter logic
  useEffect(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.full_name.toLowerCase().includes(term) ||
          b.email.toLowerCase().includes(term) ||
          b.phone.includes(term) ||
          b.booking_reference.toLowerCase().includes(term) ||
          b.property_name?.toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.check_in) - new Date(a.check_in));
    } else if (sortBy === "amount") {
      filtered.sort((a, b) => b.total_amount - a.total_amount);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.full_name.localeCompare(b.full_name));
    }

    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [bookings, searchTerm, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handleExport = () => {
    const csv = [
      ["Reference", "Guest Name", "Property", "Check-in", "Check-out", "Guests", "Amount", "Payment Status"],
      ...filteredBookings.map((b) => [
        b.booking_reference,
        b.full_name,
        b.property_name || "Unknown",
        formatDate(b.check_in),
        formatDate(b.check_out),
        b.guests,
        b.total_amount,
        b.payment_status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${Date.now()}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div className="admin-bookings">
        {/* HEADER */}
        <div className="bookings-header">
          <div>
            <h1>Bookings Management</h1>
            <p>Track and manage all property bookings</p>
          </div>
          <button className="export-btn" onClick={handleExport}>
            <FaDownload /> Export CSV
          </button>
        </div>

        {/* STATS CARDS */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon total">
                  <FaClipboardList />
                </div>
                <div>
                  <p className="stat-label">Total Bookings</p>
                  <h2>{stats.total_bookings}</h2>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon upcoming">
                  <FaCalendarCheck />
                </div>
                <div>
                  <p className="stat-label">Upcoming Check-ins</p>
                  <h2>{stats.upcoming_checkins}</h2>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon revenue">
                  <FaMoneyBill />
                </div>
                <div>
                  <p className="stat-label">Confirmed Earnings</p>
                  <h2>{formatCurrency(stats.total_revenue)}</h2>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon rate">
                  <FaPercent />
                </div>
                <div>
                  <p className="stat-label">Cancellation Rate</p>
                  <h2>{stats.cancellation_rate}%</h2>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="error-banner">
            <p>⚠️ {error}</p>
            <button onClick={fetchBookings}>Retry</button>
          </div>
        )}

        {/* CONTROLS */}
        <div className="bookings-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by guest name, email, property, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-btn" onClick={() => setSearchTerm("")}>
                ✕
              </button>
            )}
          </div>

          <div className="controls-right">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="paid">Paid Bookings</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="all">All Bookings</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Sort by Date (Newest)</option>
              <option value="amount">Sort by Amount (High to Low)</option>
              <option value="name">Sort by Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* BOOKINGS TABLE */}
        <div className="bookings-table-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading bookings...</p>
            </div>
          ) : paginatedBookings.length === 0 ? (
            <div className="empty-state">
              <FaClipboardList className="empty-icon" />
              <h3>No Bookings Found</h3>
              <p>
                {searchTerm ? "Try adjusting your search" : "Start by creating a booking"}
              </p>
            </div>
          ) : (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Guest Name</th>
                  <th>Property</th>
                  <th>Check-in / Out</th>
                  <th>Guests</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map((booking) => (
                  <tr key={booking.id} className="booking-row">
                    <td className="ref-cell">
                      <span className="ref-badge">{booking.booking_reference}</span>
                    </td>
                    <td className="name-cell">
                      <div className="guest-info">
                        <p className="bold">{booking.full_name}</p>
                      </div>
                    </td>
                    <td className="property-cell">
                      <span className="property-name">{booking.property_name || "N/A"}</span>
                    </td>
                    <td className="dates-cell">
                      <div className="dates">
                        <span>{formatDate(booking.check_in)}</span>
                        <span className="divider">→</span>
                        <span>{formatDate(booking.check_out)}</span>
                      </div>
                    </td>
                    <td className="guests-cell">{booking.guests}</td>
                    <td className="amount-cell">
                      <span className="amount">{formatCurrency(booking.total_amount)}</span>
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge status-${booking.payment_status}`}>
                        {booking.payment_status.charAt(0).toUpperCase() +
                          booking.payment_status.slice(1)}
                      </span>
                    </td>
                    <td className="contact-cell">
                      <div className="contact-info">
                        <p>{booking.email}</p>
                        <p>{booking.phone}</p>
                      </div>
                    </td>
                    <td className="actions-cell">
                      {booking.payment_status === 'paid' && booking.stay_outcome !== 'cancelled' && (
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancelBooking(booking.id, booking.booking_reference)}
                          disabled={cancelling === booking.id}
                        >
                          {cancelling === booking.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && !loading && (
          <div className="pagination-controls">
            <button
              className="page-btn"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft /> Previous
            </button>

            <div className="page-info">
              Page <span className="current-page">{currentPage}</span> of{" "}
              <span className="total-pages">{totalPages}</span>
            </div>

            <button
              className="page-btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next <FaChevronRight />
            </button>
          </div>
        )}

        {/* RESULTS INFO */}
        <div className="results-info">
          Showing {paginatedBookings.length > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(startIndex + itemsPerPage, filteredBookings.length)} of{" "}
          {filteredBookings.length} bookings
        </div>
      </div>
    </AdminLayout>
  );
}
