import React, { useState, useEffect, useRef } from "react";
import { optimizeCloudinaryUrl } from "../utils/imageUtils";
import AdminLayout from "../components/AdminLayout";
import "./AdminProperties.css";

import {
  FaBuilding,
  FaPlus,
  FaHome,
  FaEdit,
  FaTrash,
  FaMoneyBill,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaUsers,
  FaImage,
  FaInfoCircle,
  FaMap,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";

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

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* FIX LEAFLET ICON */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* MAP PICKER */
function MapPicker({ setNewProperty }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          {
            headers: {
              "User-Agent": "property-admin-app",
            },
          }
        );
        const data = await res.json();

        setNewProperty((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          address: data.display_name || prev.address,
          location:
            data.address?.city ||
            data.address?.town ||
            data.address?.state ||
            prev.location,
        }));
      } catch (err) {
        console.error("Reverse geocode failed", err);
      }
    },
  });

  return null;
}

export default function AdminProperties() {
  const [showModal, setShowModal] = useState(false);
  const [properties, setProperties] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const [newProperty, setNewProperty] = useState({
    name: "",
    address: "",
    location: "",
    price: "",
    propertyType: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    status: "Available",
    description: "",
    latitude: "",
    longitude: "",
  });

  const [imgFile, setImgFile] = useState([]);
  const [imgPreview, setImgPreview] = useState([]);
  const previewsRef = useRef([]);

  useEffect(() => {
    previewsRef.current = imgPreview;
  }, [imgPreview]);

  useEffect(() => {
    return () => {
      // revoke any leftover object URLs on unmount
      previewsRef.current?.forEach((u) => {
        try { URL.revokeObjectURL(u); } catch (e) {}
      });
    };
  }, []);

  const token = localStorage.getItem("token");

  /* FETCH PROPERTIES */
  const fetchProperties = async () => {
    try {
      const api = (await import("../api/axios")).default;
      const { data } = await api.get("/properties/admin");
      setProperties(Array.isArray(data) ? data : []);
    } catch {
      setProperties([]);
    }
  };

  useEffect(() => {
    if (token) fetchProperties();
  }, [token]);

  /* ADDRESS → MAP */
  useEffect(() => {
    const locateAddress = async () => {
      if (!newProperty.address || !newProperty.location) return;

      try {
        const query = `${newProperty.address}, ${newProperty.location}`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}`,
          { headers: { "User-Agent": "property-admin-app" } }
        );
        const data = await res.json();

        if (data[0]) {
          setNewProperty((prev) => ({
            ...prev,
            latitude: Number(data[0].lat),
            longitude: Number(data[0].lon),
          }));
        }
      } catch {}
    };

    locateAddress();
  }, [newProperty.address, newProperty.location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProperty((prev) => ({ ...prev, [name]: value }));
  };

  /* REMOVE IMAGE FROM PREVIEW */
  const removeImage = (indexToRemove) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(imgPreview[indexToRemove]);
    
    // Remove from both file and preview arrays
    setImgFile(prev => prev.filter((_, i) => i !== indexToRemove));
    setImgPreview(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  /* ADD PROPERTY */
  const handleAddProperty = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(newProperty).forEach(([k, v]) =>
        formData.append(k, v)
      );
      imgFile.forEach((file) => formData.append("images", file));

      const api = (await import("../api/axios")).default;
      await api.post("/properties", formData);

      await fetchProperties();
      setShowModal(false);
      setImgFile([]);
      // revoke preview object URLs before clearing
      previewsRef.current?.forEach((u) => { try { URL.revokeObjectURL(u); } catch (e) {} });
      setImgPreview([]);
      setPopup({ show: true, message: "Property added successfully", type: "success" });
    } catch {
      setPopup({ show: true, message: "Failed to add property", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };


  /* DELETE PROPERTY */
  /* OPEN DELETE CONFIRM MODAL */
const confirmDeleteProperty = (property) => {
  setPropertyToDelete(property);
  setShowDeleteModal(true);
};

/* DELETE PROPERTY */
const handleDeleteProperty = async () => {
  if (!propertyToDelete) return;

  setIsDeleting(true);

  try {
    const api = (await import("../api/axios")).default;
    const res = await api.delete(`/properties/${propertyToDelete.id}`);

    if (res.status < 200 || res.status >= 300) {
      throw new Error("Delete request failed");
    }

    setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete.id));

    setPopup({ show: true, message: "Property deleted successfully", type: "success" });
  } catch {
    setPopup({ show: true, message: "Failed to delete property", type: "error" });
  } finally {
    setIsDeleting(false);
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  }
};



  const propertyStats = [
    { name: "Available", value: properties.filter(p => p.status === "Available").length },
    { name: "Booked", value: properties.filter(p => p.status === "Booked").length },
  ];

  const COLORS = ["#0F4D3C", "#1A6F54"];

  return (
    <AdminLayout>
      <div className="admin-properties">

        {/* HEADER */}
        <div className="properties-header">
          <h2>My Properties</h2>
          <button
            className="add-property-btn"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Add New Property
          </button>
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
              <h3>
                {properties.filter(p => p.status === "Available").length}
              </h3>
              <p>Available</p>
            </div>
          </div>

          {/* <div className="kpi-card">
            <FaMoneyBill className="kpi-icon" />
            <div>
              <h3>₦860k</h3>
              <p>Monthly Earnings</p>
            </div>
          </div> */}
        </div>

        {/* CHARTS */}
        <div className="chart-grid">
          <div className="chart-card">
            <h3>Property Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={propertyStats}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {propertyStats.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* <div className="chart-card">
            <h3>Monthly Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[
                  { name: "Jan", earnings: 200000 },
                  { name: "Feb", earnings: 250000 },
                  { name: "Mar", earnings: 230000 },
                  { name: "Apr", earnings: 290000 },
                ]}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earnings" fill="#0F4D3C" />
              </BarChart>
            </ResponsiveContainer>
          </div> */}
        </div>

        {/* TABLE */}
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
                                <img
                                  src={optimizeCloudinaryUrl(p.images?.[0] || "/placeholder-property.jpg", 400)}
                                  alt={p.name}
                                  loading="lazy"
                                />

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
                    <button
                      className="delete-btn"
                      onClick={() => confirmDeleteProperty(p)}
                    >
                      <FaTrash />
                    </button>


                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ADD PROPERTY MODAL */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content large">
              <h3>Add New Property</h3>

              <form onSubmit={handleAddProperty} className="property-form">

                <div className="form-grid">

                  <div className="icon-input">
                    <FaHome />
                    <input name="name" placeholder="Property Name" onChange={handleChange} required />
                  </div>

                  <div className="icon-input">
                    <FaMapMarkerAlt />
                    <input name="address" placeholder="Full Address" onChange={handleChange} required />
                  </div>

                  <div className="icon-input">
                    <FaMapMarkerAlt />
                    <input name="location" placeholder="City / State" onChange={handleChange} required />
                  </div>

                  <div className="icon-input">
                    <FaMoneyBill />
                    <input
                      name="price"
                      placeholder="Price per night (₦)"
                      required
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, "");
                        setNewProperty(prev => ({ ...prev, price: value }));
                      }}
                    />

                  </div>

                  <p className="input-hint">
                    ⚠️ Enter amount without commas (e.g., 50000)
                  </p>


                  <select name="propertyType" onChange={handleChange}>
                    <option>Apartment</option>
                    <option>Studio</option>
                    <option>Duplex</option>
                    <option>Villa</option>
                  </select>

                  <div className="icon-input">
                    <FaBed />
                    <input name="bedrooms" type="number" placeholder="Bedrooms" onChange={handleChange} />
                  </div>

                  <div className="icon-input">
                    <FaBath />
                    <input name="bathrooms" type="number" placeholder="Bathrooms" onChange={handleChange} />
                  </div>

                  <div className="icon-input">
                    <FaUsers />
                    <input name="maxGuests" type="number" placeholder="Max Guests" onChange={handleChange} />
                  </div>

                  <select name="status" onChange={handleChange}>
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                  </select>
                </div>

                <div className="icon-textarea">
                  <FaInfoCircle />
                  <textarea
                    name="description"
                    placeholder="Property Description"
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="map-coordinates">
                  <div className="icon-input">
                    <FaMap />
                    <input name="latitude" placeholder="Latitude" onChange={handleChange} />
                  </div>

                  <div className="icon-input">
                    <FaMap />
                    <input name="longitude" placeholder="Longitude" onChange={handleChange} />
                  </div>
                </div>

                <div className="image-upload">
                  <label><FaImage /> Property Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      // revoke old previews
                      imgPreview.forEach((url) => URL.revokeObjectURL(url));
                      const previews = files.map((f) => URL.createObjectURL(f));
                      setImgFile(files);
                      setImgPreview(previews);
                    }}
                  />

                  <div className="preview-grid">
                    {imgPreview?.map((img, i) => (
                      <div key={i} className="preview-card">
                        <img src={img} alt="preview" loading="lazy" />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImage(i)}
                          title="Remove this image"
                        >
                          <IoClose size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {imgPreview.length > 0 && (
                    <p className="image-count">Selected: {imgPreview.length} image(s)</p>
                  )}

                  {/* MAP PICKER (ADDED BELOW FORM FIELDS) */}
                <div className="map-section">
                  <p><FaMap /> Click map or type address</p>

                  <MapContainer
                    center={[6.5244, 3.3792]}
                    zoom={12}
                    style={{ height: "300px", width: "100%", borderRadius: "10px" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapPicker setNewProperty={setNewProperty} />

                    {newProperty.latitude && (
                      <Marker
                        position={[
                          newProperty.latitude,
                          newProperty.longitude
                        ]}
                      />
                    )}
                  </MapContainer>
                </div>


                  
                </div>

                <div className="modal-buttons">
                  <button type="submit">Add Property</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}


        {/* LOADING */}
        {isSubmitting && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="spinner" />
              <p>Adding property...</p>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content delete-modal">
              <h3>Delete Property</h3>

              <p>
                Are you sure you want to delete{" "}
                <strong>{propertyToDelete?.name}</strong>?
                <br />
                <span className="danger-text">
                  This action cannot be undone.
                </span>
              </p>

              <div className="delete-modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPropertyToDelete(null);
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </button>

                <button
                  className="delete-confirm-btn"
                  onClick={handleDeleteProperty}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}


        {/* POPUP */}
        {popup.show && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p style={{ color: popup.type === "success" ? "green" : "red" }}>
                {popup.message}
              </p>
              <button onClick={() => setPopup({ show: false })}>
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
