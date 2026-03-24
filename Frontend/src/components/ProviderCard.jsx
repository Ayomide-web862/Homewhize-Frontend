import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiStar,
  FiMessageCircle,
  FiCalendar,
  FiMapPin,
  FiBriefcase
} from "react-icons/fi";

import "./ProviderCard.css";

export default function ProviderCard({ provider, onChat, onBook }) {
  const navigate = useNavigate();

  const {
    company_name,
    description,
    services = [],
    location
  } = provider || {};

  const name = company_name || "Service Provider";

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const minPrice = services.length
    ? Math.min(...services.map((s) => s.price || 0))
    : null;

  const maxPrice = services.length
    ? Math.max(...services.map((s) => s.price || 0))
    : null;

  const serviceNames = services
    .slice(0, 3)
    .map((s) => s.title)
    .filter(Boolean);

  const handleClick = () => {
    navigate(`/provider/${provider.slug}`);
  };

  return (
    <div className="provider-card-modern" onClick={handleClick}>
      
      {/* HEADER */}
      <div className="provider-card-header">

        <div className="provider-avatar-modern">
          {initials}
        </div>

        <div className="provider-header-info">
          <h3>{name}</h3>

          <div className="provider-rating-modern">
            <FiStar />
            <span>4.8</span>
          </div>
        </div>

      </div>

      {/* DESCRIPTION */}

      <p className="provider-desc-modern">
        {description ||
          "Professional cleaning services delivered with attention to detail and care."}
      </p>

      {/* SERVICES */}

      {serviceNames.length > 0 && (
        <div className="service-tags-modern">

          {serviceNames.map((s, i) => (
            <span key={i} className="service-tag">
              <FiBriefcase />
              {s}
            </span>
          ))}

        </div>
      )}

      {/* META */}

      <div className="provider-meta-modern">

        {location && (
          <div className="meta-item">
            <FiMapPin />
            <span>{location}</span>
          </div>
        )}

        {minPrice !== null && (
          <div className="meta-item price">
            ₦{minPrice} - ₦{maxPrice}
          </div>
        )}

      </div>

      {/* ACTIONS */}

      <div className="provider-actions-modern">

        <button
          className="action-btn chat"
          onClick={(e) => {
            e.stopPropagation();
            onChat && onChat(provider);
          }}
        >
          <FiMessageCircle />
          Chat
        </button>

        <button
          className="action-btn book"
          onClick={(e) => {
            e.stopPropagation();
            onBook && onBook(provider);
          }}
        >
          <FiCalendar />
          Book
        </button>

      </div>
    </div>
  );
}