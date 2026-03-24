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
import { createService, getProviderBySlug, getMyProvider } from "../api/providers.api";

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

  const [form, setForm] = useState({
    title: "",
    category: CATEGORIES[0],
    description: "",
    price: "",
    duration: "",
    image: null,
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
      [name]: files ? files[0] : value,
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
        images: form.image ? [form.image.name] : [],
      };

      const newService = await createService(provider.id, payload);

      // update UI immediately
      setServices((prev) => [newService, ...prev]);

      setForm({
        title: "",
        category: CATEGORIES[0],
        description: "",
        price: "",
        duration: "",
        image: null,
      });

      setShowForm(false);
    } catch (err) {
      console.error("Failed to create service", err);
    }
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
              <input type="file" name="image" onChange={handleChange} />
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
              <h3>{s.title}</h3>
              <span>{s.category}</span>
              <p>₦{s.price}</p>
              <p>{s.estimatedDuration}</p>
            </div>
          ))}
        </div>
      </div>
    </ServiceProviderLayout>
  );
}