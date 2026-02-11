import React from "react";
import SuperAdminLayout from "../components/Super-AdminLayout";
import "./SuperAdminBookings.css";

export default function SuperAdminBookings() {
  const bookings = [
    {
      guest: "John Doe",
      property: "Empire Luxury Suite",
      checkIn: "Jan 15, 2025",
      checkOut: "Jan 18, 2025",
      amount: "₦150,000",
      status: "Paid",
    },
    {
      guest: "Grace Ade",
      property: "Lekki Modern Loft",
      checkIn: "Jan 10, 2025",
      checkOut: "Jan 11, 2025",
      amount: "₦95,000",
      status: "Pending",
    },
    {
      guest: "Michael Lee",
      property: "5 Bedroom Detached",
      checkIn: "Jan 12, 2025",
      checkOut: "Jan 14, 2025",
      amount: "₦490,000",
      status: "Cancelled",
    },
  ];

  return (
    <SuperAdminLayout>
      <div className="bookings-page">

        {/* PAGE TITLE */}
        <div className="bookings-header">
          <h2>Bookings</h2>
          <button className="export-btn">Export CSV</button>
        </div>

        {/* FILTER BAR */}
        <div className="filter-bar">
          <select>
            <option>All Status</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>

          <input type="text" placeholder="Search guest or property..." />

          <button className="filter-btn">Filter</button>
        </div>

        {/* BOOKINGS TABLE */}
        <div className="table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Property</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((row, index) => (
                <tr key={index}>
                  <td data-label="Guest">{row.guest}</td>
                  <td data-label="Property">{row.property}</td>
                  <td data-label="Check-in">{row.checkIn}</td>
                  <td data-label="Check-out">{row.checkOut}</td>
                  <td data-label="Amount">{row.amount}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </SuperAdminLayout>
  );
}
