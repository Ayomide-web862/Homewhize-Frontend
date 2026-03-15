import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import ProviderCard from "../components/ProviderCard";
import { getProviders } from "../api/providers.api";
// Booking API removed

import {
  FiArrowLeft,
  FiUsers,
  FiBriefcase,
  FiAlertCircle,
} from "react-icons/fi";

import "./ServiceProvidersPage.css";

export default function ServiceProvidersPage() {
  const { category } = useParams(); // category is now slug
  const slug = category;
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  // Booking UI removed
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const CATEGORY_MAP = {
    residential: "Residential & Standard Cleaning",
    specialized: "Specialized Cleaning & Restoration",
    hygiene: "Hygiene & Facility Maintenance",
  };

  const decodedCategory = decodeURIComponent(slug || "").replace(/\+/g, " ");
  let slugKey = slug || "";
  if (!CATEGORY_MAP[slugKey]) {
    const found = Object.keys(CATEGORY_MAP).find(
      (k) => CATEGORY_MAP[k].toLowerCase() === decodedCategory.toLowerCase()
    );
    if (found) slugKey = found;
  }

  const displayCategory = CATEGORY_MAP[slugKey] || decodedCategory;

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const data = await getProviders(displayCategory || slugKey || null);
        if (mounted) setProviders(data || []);
      } catch (err) {
        console.error(err);
        if (mounted) setProviders([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [slugKey]);

  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase().trim();
    const list = (providers || []).filter((p) => {
      if (!q) return true;
      return (
        (p.companyName || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.categories || []).join(',').toLowerCase().includes(q)
      );
    });

    if (sortBy === "price_low") {
      return list.sort((a, b) => {
        const aMin = Math.min(...(a.services || []).map(s => s.price || 0), Infinity) || Infinity;
        const bMin = Math.min(...(b.services || []).map(s => s.price || 0), Infinity) || Infinity;
        return (aMin === Infinity ? 1 : aMin) - (bMin === Infinity ? 1 : bMin);
      });
    }

    if (sortBy === "price_high") {
      return list.sort((a, b) => {
        const aMax = Math.max(...(a.services || []).map(s => s.price || 0), -Infinity) || -Infinity;
        const bMax = Math.max(...(b.services || []).map(s => s.price || 0), -Infinity) || -Infinity;
        return (bMax === -Infinity ? 1 : bMax) - (aMax === -Infinity ? 1 : aMax);
      });
    }

    return list;
  }, [providers, query, sortBy]);

  // Booking handlers removed

  return (
    <div className="services-page">
      <Navbar />

      {/* FLOATING BACK BUTTON */}
      <button className="floating-back" onClick={() => navigate("/services")}>
        <FiArrowLeft />
      </button>

      <div className="services-content">
        {/* HERO HEADER */}
        <div className="category-hero">
          <div className="hero-left">
            <div className="category-badge">
              <FiBriefcase />
              {displayCategory}
            </div>

            <h1>Find Trusted {displayCategory} Experts</h1>

            <p>
              Browse verified professionals ready to help you. Book instantly
              and get quality service.
            </p>

            <div className="stat-pill">
              <FiUsers />
              {providers.length} Providers Available
            </div>
          </div>
        </div>

        {/* PROVIDERS GRID */}
        <div className="providers-toolbar">
          <input
            className="search-input"
            placeholder={`Search ${displayCategory} providers...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recommended">Recommended</option>
            <option value="price_low">Price: Low → High</option>
            <option value="price_high">Price: High → Low</option>
          </select>
        </div>

        <section className="providers-list">
          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              Loading providers...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="empty-state">
              <FiAlertCircle size={40} />
              <h3>No providers yet</h3>
              <p>We're onboarding experts in this category.</p>
            </div>
          )}

          {!loading &&
            filtered.map((p, i) => (
              <div
                key={p.id}
                className="provider-card-wrapper"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <ProviderCard
                  provider={p}
                  onChat={() => (window.location.href = `/provider/${p.id}`)}
                />
              </div>
            ))}
        </section>
      </div>

      {/* Booking modal removed */}
    </div>
  );
}
