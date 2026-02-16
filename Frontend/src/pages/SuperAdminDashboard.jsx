import React, { useState, useEffect } from "react";
import SuperAdminLayout from "../components/Super-AdminLayout";
import "./SuperAdminDashboard.css";
import {
  FaHome,
  FaMoneyBill,
  FaCalendarCheck,
  FaPercent
} from "react-icons/fa";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function SuperAdminDashboard() {
  /* ===============================
     STATE
  =============================== */
  const [properties, setProperties] = useState([]);
  const token = localStorage.getItem("token");

  /* ===============================
     FETCH ALL PROPERTIES
  =============================== */
  const fetchProperties = async () => {
    try {
      const api = (await import("../api/axios")).default;
      const { data } = await api.get("/properties/admin");
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      setProperties([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProperties();
    }
  }, [token]);

  /* ===============================
     SAFE STATS
  =============================== */
  const totalProperties = properties.length;

  const availableCount = properties.filter(
    p => p.status === "Available"
  ).length;

  const bookedCount = properties.filter(
    p => p.status === "Booked"
  ).length;

  /* ===============================
     CHART DATA (STATIC DEMO)
  =============================== */
  const revenueData = [
    { month: "Jan", revenue: 450000 },
    { month: "Feb", revenue: 520000 },
    { month: "Mar", revenue: 620000 },
    { month: "Apr", revenue: 580000 },
    { month: "May", revenue: 700000 },
    { month: "Jun", revenue: 760000 },
    { month: "Jul", revenue: 830000 },
    { month: "Aug", revenue: 900000 },
    { month: "Sep", revenue: 870000 },
    { month: "Oct", revenue: 910000 },
    { month: "Nov", revenue: 950000 },
    { month: "Dec", revenue: 1030000 },
  ];

  const bookingTrend = [
    { month: "Jan", bookings: 40 },
    { month: "Feb", bookings: 55 },
    { month: "Mar", bookings: 70 },
    { month: "Apr", bookings: 65 },
    { month: "May", bookings: 80 },
    { month: "Jun", bookings: 95 },
  ];

  const locationData = [
    { name: "Lekki", value: 40 },
    { name: "VI", value: 30 },
    { name: "Ikoyi", value: 20 },
    { name: "Ajah", value: 10 },
  ];

  const COLORS = ["#0F4D3C", "#1A6F54", "#4A9070", "#92B39A"];

  /* ===============================
     RENDER
  =============================== */
  return (
    <SuperAdminLayout>
      <div className="dashboard">

        {/* KPI CARDS */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <FaHome className="kpi-icon" />
            <div>
              <h3>{totalProperties}</h3>
              <p>Total Properties</p>
            </div>
          </div>

          {/* <div className="kpi-card">
            <FaCalendarCheck className="kpi-icon" />
            <div>
              <h3>247</h3>
              <p>Total Bookings</p>
            </div>
          </div> */}

          {/* <div className="kpi-card">
            <FaMoneyBill className="kpi-icon" />
            <div>
              <h3>₦12.4M</h3>
              <p>Total Revenue</p>
            </div>
          </div> */}

          {/* <div className="kpi-card">
            <FaPercent className="kpi-icon" />
            <div>
              <h3>88%</h3>
              <p>Occupancy Rate</p>
            </div>
          </div> */}
        </div>

        {/* CHARTS */}
        {/* <div className="chart-grid">

          <div className="chart-card">
            <h3>Revenue (Last 12 Months)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
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
            <h3>Popular Locations</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={locationData}
                  dataKey="value"
                  outerRadius={90}
                  label
                >
                  {locationData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        {/* RECENT BOOKINGS */}
        {/* <div className="table-card">
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
                <td>John Doe</td>
                <td>Empire Luxury Suite</td>
                <td>Jan 15, 2025</td>
                <td>₦150,000</td>
                <td className="status paid">Paid</td>
              </tr>
              <tr>
                <td>Sarah Mark</td>
                <td>5 Bedroom Detached</td>
                <td>Jan 12, 2025</td>
                <td>₦490,000</td>
                <td className="status pending">Pending</td>
              </tr>
              <tr>
                <td>Tunde James</td>
                <td>Modern Loft</td>
                <td>Jan 10, 2025</td>
                <td>₦95,000</td>
                <td className="status paid">Paid</td>
              </tr>
            </tbody>
          </table>
        </div> */}

      </div>
    </SuperAdminLayout>
  );
}
