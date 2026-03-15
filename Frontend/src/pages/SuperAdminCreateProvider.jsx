import React, { useState, useEffect } from "react";
import SuperAdminLayout from "../components/Super-AdminLayout";
import "./SuperAdminCreateProvider.css";

import api from "../api/axios";
import { getProviders, deleteProvider } from "../api/providers.api";

import {
  FiSave,
  FiEye,
  FiEyeOff,
  FiBriefcase,
  FiPhone,
  FiMail,
  FiMapPin,
  FiUserPlus,
  FiLayers
} from "react-icons/fi";

/* SERVICE CATEGORIES */
const SERVICE_CATEGORIES = [
  "Residential & Standard Cleaning",
  "Specialized Cleaning & Restoration",
  "Hygiene & Facility Maintenance"
];

export default function SuperAdminCreateProvider() {
  const [form, setForm] = useState({
    company_name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    categories: [],
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [providersList, setProvidersList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProvider, setDeletingProvider] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const loadProviders = async () => {
    const list = await getProviders();
    setProvidersList(list || []);
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const toggleCategory = (cat) => {
    setForm((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.company_name || !form.email || !form.password) {
      alert("Required fields missing");
      return;
    }

    setLoading(true);

    try {
      // Use atomic endpoint to create user + provider in a transaction
      const res = await api.post('/admin/create-provider', {
        company_name: form.company_name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: form.address,
        categories: form.categories.join(','),
        role: 'cleaner',
      });

      setSuccessMessage('Provider created successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      await loadProviders();

      setForm({
        company_name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        categories: [],
      });
    } catch (err) {
      alert("Creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="provider-page">
        <div className="provider-container">

            {/* HEADER */}
            <div className="provider-header">
              <div>
                <h2>Cleaning Service Providers</h2>
                <p>Register and manage all cleaning service companies</p>
              </div>
            </div>

            {/* FORM CARD */}
            <div className="provider-card">
              <h3 className="card-title">
                <FiUserPlus /> Register New Provider
              </h3>

              <form onSubmit={handleSubmit} className="provider-form">

                {/* COMPANY NAME */}
                <div className="input-group">
                  <label>Company Name</label>
                  <div className="input-icon">
                    <FiBriefcase />
                    <input
                      type="text"
                      placeholder="Company name"
                      value={form.company_name}
                      onChange={(e) =>
                        setForm({ ...form, company_name: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="input-group">
                  <label>Email</label>
                  <div className="input-icon">
                    <FiMail />
                    <input
                      type="email"
                      placeholder="Provider email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="input-group">
                  <label>Temporary Password</label>
                  <div className="input-icon password">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                    <span onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                  </div>
                </div>

                {/* PHONE */}
                <div className="input-group">
                  <label>Phone</label>
                  <div className="input-icon">
                    <FiPhone />
                    <input
                      placeholder="Phone number"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="input-group full">
                  <label>Address</label>
                  <div className="input-icon">
                    <FiMapPin />
                    <input
                      placeholder="Business address"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* CATEGORIES */}
                <div className="input-group full">
                  <label>
                    <FiLayers /> Service Categories
                  </label>

                  <div className="categories">
                    {SERVICE_CATEGORIES.map((cat) => (
                      <div
                        key={cat}
                        className={`category-chip ${
                          form.categories.includes(cat) ? "active" : ""
                        }`}
                        onClick={() => toggleCategory(cat)}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                </div>

                <button className="submit-btn" disabled={loading}>
                  <FiSave />
                  {loading ? "Creating..." : "Create Provider"}
                </button>
              </form>
            </div>

            {/* PROVIDERS TABLE */}
            <div className="provider-card">
              <h3 className="card-title">Registered Providers</h3>

              <div className="providers-table-wrapper">
                <table className="providers-table">
                  <thead>
                    <tr>
                      <th>S/N</th>
                      <th>Company</th>
                      <th>Email</th>
                      <th>Categories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providersList.map((p, i) => (
                      <tr key={p.id}>
                        <td>{i + 1}</td>
                        <td>{p.company_name}</td>
                        <td>{p.email}</td>
                        <td>{(p.categories || []).join(", ")}</td>
                        <td>
                          <button
                            className="danger-btn"
                            onClick={() => {
                              setDeletingProvider(p);
                              setShowDeleteModal(true);
                              setDeleteError(null);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Delete confirmation modal */}
            {showDeleteModal && (
              <div className="modal-backdrop" onClick={() => { if (!deleteLoading) setShowDeleteModal(false); }}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <h3>Delete Provider</h3>
                  <p>Are you sure you want to delete <strong>{deletingProvider?.company_name}</strong>? This will also remove the linked user and cannot be undone.</p>
                  {deleteError && <div className="modal-error">{deleteError}</div>}
                  <div className="modal-actions">
                    <button className="btn" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>Cancel</button>
                    <button
                      className="danger-btn"
                      onClick={async () => {
                        try {
                          setDeleteLoading(true);
                          setDeleteError(null);
                          await deleteProvider(deletingProvider.id);
                          await loadProviders();
                          setSuccessMessage('Provider deleted');
                          setTimeout(() => setSuccessMessage(null), 3000);
                          setShowDeleteModal(false);
                        } catch (err) {
                          console.error(err);
                          setDeleteError(err?.response?.data?.message || err?.message || 'Delete failed');
                        } finally {
                          setDeleteLoading(false);
                        }
                      }}
                    >
                      {deleteLoading ? 'Deleting…' : 'Delete Provider'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {successMessage && <div className="toast-success">{successMessage}</div>}
        </div>
      </div>
  </SuperAdminLayout>
  );
}