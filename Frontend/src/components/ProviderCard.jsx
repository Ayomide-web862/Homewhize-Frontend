import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCouch,
  FaSoap,
  FaStar,
  FaCommentDots,
  FaCalendarCheck
} from "react-icons/fa";
import "./ProviderCard.css";

export default function ProviderCard({ provider, onChat, onBook }) {
  const navigate = useNavigate();

  const { company_name, description, services = [], categories = [] } =
    provider || {};

  const companyName = company_name || "Provider Name";

  const priceRange = services.length
    ? `₦${Math.min(...services.map((s) => s.price || 0))} - ₦${Math.max(
        ...services.map((s) => s.price || 0)
      )}`
    : "N/A";

  const getCategoryIcon = () => {
    const first = categories[0] || "";

    if (first.includes("Residential"))
      return <FaHome className="category-icon" />;

    if (first.includes("Specialized"))
      return <FaCouch className="category-icon" />;

    if (first.includes("Hygiene"))
      return <FaSoap className="category-icon" />;

    return <FaHome className="category-icon" />;
  };

  const initials = companyName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const serviceTags = services
    .slice(0, 3)
    .map((s) => s.title || s.name)
    .filter(Boolean);

  const handleCardClick = () => {
    navigate(`/provider/${provider?.id}`);
  };

  return (
    <div className="provider-card" onClick={handleCardClick}>
      <div className="provider-header">

        <div className="provider-avatar">
          {initials}
        </div>

        <div className="provider-title">
          <h3>{companyName}</h3>

          <div className="provider-rating">
            <FaStar />
            <span>4.5</span>
          </div>
        </div>

        <div className="category-badge">
          {getCategoryIcon()}
          <span>{categories[0] || "Service"}</span>
        </div>

      </div>

      <p className="provider-description">
        {description || "No description provided."}
      </p>

      {serviceTags.length > 0 && (
        <div className="service-list">
          {serviceTags.map((tag, i) => (
            <div className="service-chip" key={i}>
              {tag}
            </div>
          ))}
        </div>
      )}

      <div className="provider-footer">

        <div className="price-range">
          {priceRange}
        </div>

        <div className="provider-actions">

          <button
            className="btn chat"
            onClick={(e) => {
              e.stopPropagation();
              onChat && onChat(provider);
            }}
          >
            <FaCommentDots />
            Chat
          </button>

          <button
            className="btn book"
            onClick={(e) => {
              e.stopPropagation();
              onBook && onBook(provider);
            }}
          >
            <FaCalendarCheck />
            Book
          </button>

        </div>
      </div>
    </div>
  );
}