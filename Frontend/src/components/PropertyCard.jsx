import React from "react";
import {
  FaMapMarkerAlt,
  FaMoneyBill,
  FaBed,
  FaBath,
  FaUsers,
  FaImage,
  FaUser,
  FaEnvelope,
  FaTrash,
} from "react-icons/fa";

function PropertyCard({ property, onDelete }) {
  return (
    <div className="property-card">
      <div className="property-header">
        <h3>{property.name}</h3>
        <button
          className="delete-btn"
          onClick={() => onDelete(property)}
          title="Delete Property"
          type="button"
        >
          <FaTrash />
        </button>
      </div>

      <div className="property-details">
        <div className="detail-item">
          <FaMapMarkerAlt />
          <span>{property.address}, {property.location}</span>
        </div>

        <div className="detail-item">
          <FaMoneyBill />
          <span className="price">
            ₦{Number(property.price).toLocaleString()}
            <small>/night</small>
          </span>
        </div>

        <div className="detail-item">
          <FaBed />
          <span>{property.bedrooms} beds</span>
        </div>

        <div className="detail-item">
          <FaBath />
          <span>{property.bathrooms} baths</span>
        </div>

        <div className="detail-item">
          <FaUsers />
          <span>{property.max_guests} guests</span>
        </div>

        <div className="detail-item">
          <FaImage />
          <span>{property.images?.length || 0} images</span>
        </div>
      </div>

      <div className="admin-info">
        <div className="admin-detail">
          <FaUser />
          <span>{property.admin_name || "Unknown Admin"}</span>
        </div>
        <div className="admin-detail">
          <FaEnvelope />
          <span>{property.admin_email || "N/A"}</span>
        </div>
      </div>

      <div className="property-status">
        <span className={`status-badge ${property.status?.toLowerCase()}`}>
          {property.status || "Unknown"}
        </span>
      </div>
    </div>
  );
}

export default React.memo(PropertyCard);
