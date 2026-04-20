import React, { useState, useEffect } from "react";
import SuperAdminLayout from "../components/Super-AdminLayout";
import { getBookingsForSettlement, approveOwnerPayout, refundCautionFee, releaseCautionFeeToOwner } from "../api/bookings.api";
import "./SuperAdminSettlement.css";

export default function SuperAdminSettlement() {
  const [activeTab, setActiveTab] = useState("awaiting_review");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewNote, setReviewNote] = useState("");

  useEffect(() => {
    fetchBookings(activeTab);
  }, [activeTab]);

  const fetchBookings = async (status) => {
    setLoading(true);
    try {
      const response = await getBookingsForSettlement(status);
      // API returns { bookings: [...], pagination: {...} }
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]); // Ensure bookings is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayout = async (bookingId) => {
    if (!reviewNote.trim()) {
      alert("Please enter a review note");
      return;
    }

    try {
      await approveOwnerPayout(bookingId, reviewNote);
      alert("Owner payout approved successfully");
      fetchBookings(activeTab);
      setSelectedBooking(null);
      setReviewNote("");
    } catch (error) {
      console.error("Error approving payout:", error);
      alert("Failed to approve payout");
    }
  };

  const handleRefundCautionFee = async (bookingId) => {
    if (!reviewNote.trim()) {
      alert("Please enter a review note");
      return;
    }

    try {
      await refundCautionFee(bookingId, reviewNote);
      alert("Caution fee refunded to guest successfully");
      fetchBookings(activeTab);
      setSelectedBooking(null);
      setReviewNote("");
    } catch (error) {
      console.error("Error refunding caution fee:", error);
      alert("Failed to refund caution fee");
    }
  };

  const handleReleaseCautionFee = async (bookingId) => {
    if (!reviewNote.trim()) {
      alert("Please enter a review note");
      return;
    }

    try {
      await releaseCautionFeeToOwner(bookingId, reviewNote);
      alert("Caution fee released to owner successfully");
      fetchBookings(activeTab);
      setSelectedBooking(null);
      setReviewNote("");
    } catch (error) {
      console.error("Error releasing caution fee:", error);
      alert("Failed to release caution fee");
    }
  };

  // Safely calculate tab counts
  const getTabCount = (statusFilter) => {
    if (!Array.isArray(bookings)) return 0;
    return bookings.filter(booking => {
      if (statusFilter === "awaiting_review") {
        return booking.payout_review_status === "awaiting_review";
      } else if (statusFilter === "disputes") {
        return booking.dispute_status === "open";
      } else if (statusFilter === "completed") {
        return booking.payout_review_status === "completed";
      }
      return false;
    }).length;
  };

  const tabs = [
    { id: "awaiting_review", label: "Awaiting Review", count: getTabCount("awaiting_review") },
    { id: "disputes", label: "Disputes", count: getTabCount("disputes") },
    { id: "completed", label: "Completed Settlements", count: getTabCount("completed") },
  ];

  return (
    <SuperAdminLayout>
      <div className="settlement-page">
        <div className="settlement-header">
          <h2>Settlement Management</h2>
          <p>Manage shortlet payments, owner payouts, and caution fee settlements</p>
        </div>

        {/* TABS */}
        <div className="settlement-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* BOOKINGS LIST */}
        <div className="bookings-list">
          {loading ? (
            <div className="loading">Loading bookings...</div>
          ) : !Array.isArray(bookings) || bookings.length === 0 ? (
            <div className="no-bookings">No bookings found for this category</div>
          ) : (
            bookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-info">
                  <div className="booking-header">
                    <h3>{booking.property_title || 'Unknown Property'}</h3>
                    <span className={`status ${booking.payout_review_status || 'unknown'}`}>
                      {booking.payout_review_status || 'Unknown'}
                    </span>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span>Guest:</span>
                      <span>{booking.guest_name || 'Unknown'}</span>
                    </div>
                    <div className="detail-row">
                      <span>Owner:</span>
                      <span>{booking.owner_name || 'Unknown'}</span>
                    </div>
                    <div className="detail-row">
                      <span>Dates:</span>
                      <span>
                        {booking.check_in_date ? new Date(booking.check_in_date).toLocaleDateString() : 'Unknown'} - {' '}
                        {booking.check_out_date ? new Date(booking.check_out_date).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Total Amount:</span>
                      <span>₦{booking.total_amount ? Number(booking.total_amount).toLocaleString() : '0'}</span>
                    </div>
                    <div className="detail-row">
                      <span>Platform Fee (8%):</span>
                      <span>₦{booking.platform_fee_amount ? Number(booking.platform_fee_amount).toLocaleString() : '0'}</span>
                    </div>
                    <div className="detail-row">
                      <span>Owner Earnings:</span>
                      <span>₦{booking.owner_earnings_amount ? Number(booking.owner_earnings_amount).toLocaleString() : '0'}</span>
                    </div>
                    <div className="detail-row">
                      <span>Caution Fee:</span>
                      <span>₦{booking.caution_fee ? Number(booking.caution_fee).toLocaleString() : '0'}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-actions">
                  {activeTab === "awaiting_review" && booking.payout_review_status === "awaiting_review" && (
                    <>
                      <button
                        className="action-btn approve"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        Review & Approve
                      </button>
                    </>
                  )}

                  {activeTab === "disputes" && booking.dispute_status === "open" && (
                    <div className="dispute-info">
                      <p>Dispute opened - requires manual review</p>
                    </div>
                  )}

                  {activeTab === "completed" && (
                    <div className="completed-info">
                      <p>Settlement completed</p>
                      {booking.payout_reviewed_at && (
                        <p>Reviewed on {new Date(booking.payout_reviewed_at).toLocaleDateString()}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* REVIEW MODAL */}
        {selectedBooking && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Review Booking Settlement</h3>

              <div className="booking-review">
                <div className="review-section">
                  <h4>Booking Details</h4>
                  <p><strong>Property:</strong> {selectedBooking.property_title || 'Unknown'}</p>
                  <p><strong>Guest:</strong> {selectedBooking.guest_name || 'Unknown'}</p>
                  <p><strong>Owner:</strong> {selectedBooking.owner_name || 'Unknown'}</p>
                  <p><strong>Dates:</strong> {selectedBooking.check_in_date ? new Date(selectedBooking.check_in_date).toLocaleDateString() : 'Unknown'} - {selectedBooking.check_out_date ? new Date(selectedBooking.check_out_date).toLocaleDateString() : 'Unknown'}</p>
                </div>

                <div className="review-section">
                  <h4>Payment Breakdown</h4>
                  <p><strong>Total Paid:</strong> ₦{selectedBooking.total_amount ? Number(selectedBooking.total_amount).toLocaleString() : '0'}</p>
                  <p><strong>Platform Fee (8%):</strong> ₦{selectedBooking.platform_fee_amount ? Number(selectedBooking.platform_fee_amount).toLocaleString() : '0'}</p>
                  <p><strong>Owner Earnings:</strong> ₦{selectedBooking.owner_earnings_amount ? Number(selectedBooking.owner_earnings_amount).toLocaleString() : '0'}</p>
                  <p><strong>Caution Fee:</strong> ₦{selectedBooking.caution_fee ? Number(selectedBooking.caution_fee).toLocaleString() : '0'}</p>
                </div>

                <div className="review-section">
                  <label htmlFor="reviewNote">Review Note:</label>
                  <textarea
                    id="reviewNote"
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Enter review notes for this settlement decision..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="btn cancel"
                  onClick={() => {
                    setSelectedBooking(null);
                    setReviewNote("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn approve"
                  onClick={() => handleApprovePayout(selectedBooking.id)}
                >
                  Approve Owner Payout
                </button>
                <button
                  className="btn refund"
                  onClick={() => handleRefundCautionFee(selectedBooking.id)}
                >
                  Refund Caution Fee
                </button>
                <button
                  className="btn release"
                  onClick={() => handleReleaseCautionFee(selectedBooking.id)}
                >
                  Release Caution Fee to Owner
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}