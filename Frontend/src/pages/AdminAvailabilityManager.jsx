import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import "./AdminAvailabilityManager.css";

import {
  FaBuilding,
  FaPlus,
  FaHome,
  FaEdit,
  FaTrash,
  FaMoneyBill,
  FaMapMarkerAlt,  
  FaTag, 
  FaAlignLeft, 
  FaImage, 
  FaTimes
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminAvailabilityManager() {
  const [showModal, setShowModal] = useState(false);
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({
    name: "",
    location: "",
    price: "",
    status: "Available",
    description: "",
  });


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });


  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const api = (await import("../api/axios")).default;
        const { data } = await api.get("/properties/public");
        setProperties(Array.isArray(data) ? data : []);
      } catch {}
    })();
  }, []);

  // SAMPLE PROPERTY STATS
const propertyStats = [
  { name: "Available", value: properties.filter(p => p.status === "Available").length },
  { name: "Booked", value: properties.filter(p => p.status === "Booked").length },
];
const COLORS = ["#0F4D3C", "#1A6F54"];


  // Handle input changes
  const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "img") {
    const file = files[0];
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  } else {
    setNewProperty({ ...newProperty, [name]: value });
  }
};


  // Add new property
  const handleAddProperty = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", newProperty.name);
      formData.append("location", newProperty.location);
      formData.append("price", newProperty.price);
      formData.append("status", newProperty.status);
      formData.append("description", newProperty.description);
      formData.append("image", imgFile);

      const api = (await import("../api/axios")).default;
      await api.post("/properties", formData);

      const { data } = await api.get("/properties/public");
      setProperties(Array.isArray(data) ? data : []);

    setPopup({
      show: true,
      message: "Property added successfully",
      type: "success",
    });

    setShowModal(false);
    setImgFile(null);
    setImgPreview(null);
  } catch (error) {
    setPopup({
      show: true,
      message: "Failed to add property",
      type: "error",
    });
  } finally {
    setIsSubmitting(false);
  }
};




  return (
    <AdminLayout>
      <div className="admin-properties">
        {/* PAGE HEADER */}
        <div className="properties-header">
          <h2>My Properties</h2>
        </div>

        {/* KPI CARDS */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <FaBuilding className="kpi-icon" />
            <div>
              <h3>{properties.length}</h3>
              <p>Total Properties</p>
            </div>
          </div>

          <div className="kpi-card">
            <FaHome className="kpi-icon" />
            <div>
              <h3>{properties.filter(p => p.status === "Available").length}</h3>
              <p>Available</p>
            </div>
          </div>
        </div>

        {/* PROPERTIES TABLE */}
        <div className="table-card">
          <h3>Property List</h3>
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id}>
                  <td className="property-info-cell">
                    <img src={p.image_url} alt="property" />
                    <span>{p.name}</span>
                  </td>
                  <td>{p.location}</td>
                  <td>{p.price}</td>
                  <td>
                    <span className={`status-badge ${p.status.toLowerCase()}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="edit-btn"><FaEdit /></button>
                    <button className="delete-btn"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </AdminLayout>
  );
}