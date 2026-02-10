import React from "react";
import AdminLayout from "../components/AdminLayout";
import "./AdminBookings.css";

import {
  FaCalendarCheck,
  FaMoneyBill,
  FaClipboardList,
  FaHome
} from "react-icons/fa";

import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function AdminBookings() {

  // SAMPLE CHART DATA
  const bookingTrend = [
    { month: "Jan", bookings: 12 },
    { month: "Feb", bookings: 18 },
    { month: "Mar", bookings: 25 },
    { month: "Apr", bookings: 21 },
    { month: "May", bookings: 30 },
    { month: "Jun", bookings: 33 },
  ];

  const cancellationTrend = [
    { month: "Jan", cancelled: 2 },
    { month: "Feb", cancelled: 3 },
    { month: "Mar", cancelled: 1 },
    { month: "Apr", cancelled: 4 },
    { month: "May", cancelled: 3 },
    { month: "Jun", cancelled: 2 },
  ];

  const bookingStatus = [
    { name: "Paid", value: 68 },
    { name: "Pending", value: 22 },
    { name: "Cancelled", value: 10 },
  ];

  const COLORS = ["#0F4D3C", "#1A6F54", "#B12727"];

  return (
    <AdminLayout>
      <div className="admin-bookings">

        {/* KPI CARDS */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <FaClipboardList className="kpi-icon" />
            <div>
              <h3>92</h3>
              <p>Total Bookings</p>
            </div>
          </div>

          <div className="kpi-card">
            <FaCalendarCheck className="kpi-icon" />
            <div>
              <h3>74</h3>
              <p>Upcoming Check-ins</p>
            </div>
          </div>

          <div className="kpi-card">
            <FaMoneyBill className="kpi-icon" />
            <div>
              <h3>₦1.9M</h3>
              <p>Confirmed Earnings</p>
            </div>
          </div>

          <div className="kpi-card">
            <FaHome className="kpi-icon" />
            <div>
              <h3>12%</h3>
              <p>Cancellation Rate</p>
            </div>
          </div>
        </div>

        {/* CHART GRID */}
        <div className="chart-grid">

          <div className="chart-card">
            <h3>Monthly Bookings Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={bookingTrend}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#1A6F54" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Cancellations Overview</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={cancellationTrend}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="cancelled"
                  stroke="#B12727"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Booking Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={bookingStatus}
                  nameKey="name"
                  dataKey="value"
                  outerRadius={85}
                  label
                >
                  {bookingStatus.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* BOOKINGS TABLE */}
        <div className="table-card">
          <h3>Recent Bookings</h3>

          <table>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Property</th>
                <th>Check-in</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Andrew Cole</td>
                <td>Ocean View Apartment</td>
                <td>Jan 14, 2025</td>
                <td>₦85,000</td>
                <td className="status paid">Paid</td>
              </tr>

              <tr>
                <td>Mary James</td>
                <td>4 Bedroom Duplex</td>
                <td>Jan 10, 2025</td>
                <td>₦265,000</td>
                <td className="status pending">Pending</td>
              </tr>

              <tr>
                <td>Tolu Adebayo</td>
                <td>Luxury Studio</td>
                <td>Jan 9, 2025</td>
                <td>₦55,000</td>
                <td className="status cancelled">Cancelled</td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
}
