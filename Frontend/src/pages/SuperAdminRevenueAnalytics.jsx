import React from "react";
import SuperAdminLayout from "../components/Super-AdminLayout";
import "./SuperAdminRevenueAnalytics.css";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function SuperAdminRevenueAnalytics() {

  const monthlyRevenue = [
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

  const propertyRevenue = [
    { name: "Empire Suite", value: 2400000 },
    { name: "Modern Loft", value: 1800000 },
    { name: "Detached Duplex", value: 3200000 },
    { name: "Luxury Penthouse", value: 4100000 },
  ];

  const locationRevenue = [
    { name: "Lekki", value: 4200000 },
    { name: "Ikoyi", value: 3100000 },
    { name: "VI", value: 2700000 },
    { name: "Ajah", value: 1500000 },
  ];

  const COLORS = ["#0F4D3C", "#1A6F54", "#4A9070", "#92B39A"];

  return (
    <SuperAdminLayout>
      <div className="revenue-page">

        {/* PAGE HEADER */}
        <div className="revenue-header">
          <h2>Revenue Analytics</h2>
          <button className="export-btn">Download Report</button>
        </div>

        {/* FILTER BAR */}
        <div className="filter-bar">
          <div>
            <label>Date From</label>
            <input type="date" />
          </div>

          <div>
            <label>Date To</label>
            <input type="date" />
          </div>

          <div>
            <label>Property</label>
            <select>
              <option>All Properties</option>
              <option>Empire Suite</option>
              <option>Modern Loft</option>
              <option>Detached Duplex</option>
              <option>Luxury Penthouse</option>
            </select>
          </div>

          <button className="filter-btn">Apply Filter</button>
        </div>

        {/* REVENUE STATS SUMMARY */}
        <div className="summary-grid">

          <div className="summary-card">
            <h3>Total Revenue</h3>
            <p>₦12,430,000</p>
          </div>

          <div className="summary-card">
            <h3>Average Monthly Revenue</h3>
            <p>₦1,036,000</p>
          </div>

          <div className="summary-card">
            <h3>Top Location</h3>
            <p>Lekki</p>
          </div>

          <div className="summary-card">
            <h3>Best Performing Property</h3>
            <p>Luxury Penthouse</p>
          </div>

        </div>

        {/* CHARTS */}
        <div className="charts-grid">

          {/* MONTHLY REVENUE */}
          <div className="chart-card">
            <h3>Monthly Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyRevenue}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#0F4D3C" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* PROPERTY REVENUE */}
          <div className="chart-card">
            <h3>Revenue by Property</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={propertyRevenue}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1A6F54" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* LOCATION REVENUE */}
          <div className="chart-card">
            <h3>Revenue by Location</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={locationRevenue}
                  dataKey="value"
                  outerRadius={90}
                  label
                >
                  {locationRevenue.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
    </SuperAdminLayout>
  );
}
