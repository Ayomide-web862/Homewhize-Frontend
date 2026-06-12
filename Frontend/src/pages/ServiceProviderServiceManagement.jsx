import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiClock,
  FiTag,
  FiImage,
} from "react-icons/fi";
import "./ServiceProviderServiceManagement.css";
import ServiceProviderLayout from "../components/ServiceProviderLayout";
import { createService, deleteService, getProviderBySlug, getMyProvider } from "../api/providers.api";

const CATEGORIES = [
  "Residential & Standard Cleaning",
  "Specialized Cleaning & Restoration",
  "Hygiene & Facility Maintenance",
];

export default function ServiceProviderServiceManagement() {
  const { slug } = useParams(); // get slug from route

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingService, setIsDeletingService] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category: CATEGORIES[0],
    description: "",
    price: "",
    duration: "",
    images: [],
  });

  // 🔹 Load provider info — use slug when present, otherwise load authenticated user's provider
  useEffect(() => {
    let mounted = true;
    async function loadProvider() {
      try {
        let p = null;
        if (slug) {
          p = await getProviderBySlug(slug);
        } else {
          p = await getMyProvider();
        }

        if (!mounted) return;

        if (!p) {
          setProvider(null);
          setServices([]);
          return;
        }

        setProvider(p);
        setServices(p.services || []);
      } catch (err) {
        console.error("Failed to load provider", err);
        if (mounted) {
          setProvider(null);
          setServices([]);
        }
      }
    }

    loadProvider();
    return () => { mounted = false; };
  }, [slug]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? Array.from(files) : value,
    });
  };

  // 🔥 CREATE SERVICE — production-safe
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!provider) return;

    try {
      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        price: form.price,
        estimatedDuration: form.duration,
      };

      const files = form.images || [];
      const newService = await createService(provider.id, payload, files);

      // update UI immediately
      setServices((prev) => [newService, ...prev]);

      setForm({
        title: "",
        category: CATEGORIES[0],
        description: "",
        price: "",
        duration: "",
        images: [],
      });

      setShowForm(false);
    } catch (err) {
      console.error("Failed to create service", err);
    }
  };

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const confirmDeleteService = async () => {
    if (!provider || !serviceToDelete) return;
    setIsDeletingService(true);
    setDeleteError(null);

    try {
      await deleteService(provider.id, serviceToDelete.id);
      setServices((prev) => prev.filter((item) => item.id !== serviceToDelete.id));
      setShowDeleteModal(false);
      setServiceToDelete(null);
    } catch (err) {
      console.error("Failed to delete service", err);
      setDeleteError(err?.response?.data?.message || err?.message || "Failed to delete service. Please try again.");
    } finally {
      setIsDeletingService(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setServiceToDelete(null);
    setDeleteError(null);
  };

  return (
    <ServiceProviderLayout>
      <div className="sp-services-page">
        <div className="sp-section-header">
          <div>
            <h1>Services Management</h1>
            <p>Manage the services you offer</p>
          </div>

          <button
            className="sp-primary-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <FiPlus /> Add Service
          </button>
        </div>

        {showForm && (
          <form className="sp-service-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <FiTag />
              <input
                name="title"
                placeholder="Service Title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <textarea
              name="description"
              placeholder="Service Description"
              value={form.description}
              onChange={handleChange}
            />

            <div className="form-group">
              <span>₦</span>
              <input
                name="price"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <FiClock />
              <input
                name="duration"
                placeholder="Estimated Duration"
                value={form.duration}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <FiImage />
              <input type="file" name="images" onChange={handleChange} multiple accept="image/*" />
            </div>

            <button type="submit" className="sp-primary-btn">
              Save Service
            </button>
          </form>
        )}

        {/* SERVICES GRID */}
        <div className="sp-service-grid">
          {services.map((s) => (
            <div className="sp-service-card" key={s.id}>
              <div className="sp-service-card-header">
                <h3>{s.title}</h3>
                <button
                  type="button"
                  className="sp-delete-btn"
                  onClick={() => handleDeleteClick(s)}
                >
                  <FiTrash2 className="sp-btn-icon" />
                  {/* <span>Delete</span> */}
                </button>
              </div>
              <span>{s.category}</span>
              <p>₦{s.price}</p>
              <p>{s.estimatedDuration}</p>
            </div>
          ))}
        </div>

        {showDeleteModal && serviceToDelete && (
          <div className="sp-modal-overlay" onClick={cancelDelete}>
            <div className="sp-delete-modal" onClick={(e) => e.stopPropagation()}>
              <div className="sp-modal-icon">
                <FiTrash2 />
              </div>

              <h2>Delete Service?</h2>

              <p>
                You are about to permanently delete{" "}
                <strong>{serviceToDelete.title}</strong>. This action cannot be undone.
              </p>

              {deleteError && <div className="sp-modal-error">{deleteError}</div>}

              <div className="sp-modal-actions">
                <button
                  type="button"
                  className="sp-modal-cancel-btn"
                  onClick={cancelDelete}
                  disabled={isDeletingService}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="sp-modal-delete-btn"
                  onClick={confirmDeleteService}
                  disabled={isDeletingService}
                >
                  <FiTrash2 />
                  {isDeletingService ? "Deleting..." : "Delete Service"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ServiceProviderLayout>
  );
}