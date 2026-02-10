import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import "./AdminDashboard.css";
import { FaHome, FaCalendarCheck, FaMoneyBill, FaBuilding } from "react-icons/fa";

import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {

  const [properties, setProperties] = useState([]);
  const token = localStorage.getItem("token");


  // SAMPLE DATA FOR ADMIN LEVEL
  const revenueData = [
    { month: "Jan", earnings: 120000 },
    { month: "Feb", earnings: 150000 },
    { month: "Mar", earnings: 170000 },
    { month: "Apr", earnings: 165000 },
    { month: "May", earnings: 220000 },
    { month: "Jun", earnings: 245000 },
  ];

  const bookingTrend = [
    { month: "Jan", bookings: 12 },
    { month: "Feb", bookings: 18 },
    { month: "Mar", bookings: 25 },
    { month: "Apr", bookings: 21 },
    { month: "May", bookings: 30 },
    { month: "Jun", bookings: 33 },
  ];


  useEffect(() => {
  import("../api/axios").then(({ default: api }) => {
    api.get("/properties/admin")
      .then(({ data }) => setProperties(Array.isArray(data) ? data : []))
      .catch(() => setProperties([]));
  });
}, [token]);

  
    // SAMPLE PROPERTY STATS
  const propertyStats = [
    { name: "Available", value: properties.filter(p => p.status === "Available").length },
    { name: "Booked", value: properties.filter(p => p.status === "Booked").length },
  ];
  const COLORS = ["#0F4D3C", "#1A6F54"];
  

  return (
    <AdminLayout>
      <div className="admin-dashboard">

        {/* KPI CARDS */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <FaBuilding className="kpi-icon" />
            <div>
              <h3>{properties.length}</h3>
              <p>My Properties</p>
            </div>
          </div>

          <div className="kpi-card">
            <FaCalendarCheck className="kpi-icon" />
            <div>
              <h3>92</h3>
              <p>Total Bookings</p>
            </div>
          </div>

          <div className="kpi-card">
            <FaMoneyBill className="kpi-icon" />
            <div>
              <h3>₦2.4M</h3>
              <p>Total Earnings</p>
            </div>
          </div>

          <div className="kpi-card">
            <FaHome className="kpi-icon" />
            <div>
              <h3>78%</h3>
              <p>Occupancy Rate</p>
            </div>
          </div>
        </div>

        {/* CHART GRID */}
        <div className="chart-grid">

          <div className="chart-card">
            <h3>Earnings (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#0F4D3C"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Bookings Trend</h3>
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
            <h3>Property Status</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={propertyStats}
                  nameKey="name"
                  dataKey="value"
                  outerRadius={90}
                  label
                >
                  {propertyStats.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* RECENT BOOKINGS TABLE */}
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
                <td>Temi Adeshina</td>
                <td>Luxury Studio</td>
                <td>Jan 9, 2025</td>
                <td>₦55,000</td>
                <td className="status paid">Paid</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
}
