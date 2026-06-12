import React, { useState, useEffect, useCallback } from "react";
import SuperAdminLayout from "../components/Super-AdminLayout";
import PropertyCard from "../components/PropertyCard";
import "./SuperAdminPropertyManagement.css";
import { FaBuilding } from "react-icons/fa";
import api from "../api/axios";

export default function SuperAdminPropertyManagement() {
  const PAGE_SIZE = 10;

  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProperties = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get(
        `/properties/superadmin/all?page=${page}&limit=${PAGE_SIZE}`
      );

      setProperties(Array.isArray(data.properties) ? data.properties : []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || page);
    } catch (err) {
      console.error("Failed to load properties:", err);
      setError("Could not load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties(currentPage);
  }, [currentPage, fetchProperties]);

  const handlePrevious = () => {
    if (currentPage > 1 && !loading) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !loading) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleOpenDelete = (property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;

    setIsDeleting(true);
    setError("");

    try {
      await api.delete(`/properties/${propertyToDelete.id}`);

      setShowDeleteModal(false);
      setPropertyToDelete(null);

      if (properties.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchProperties(currentPage);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Could not delete property. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="super-admin-property-management">
        <div className="header">
          <h1>Property Management</h1>
          <p>Manage all properties across the platform</p>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="controls">
          <button
            className="nav-btn"
            onClick={handlePrevious}
            disabled={currentPage <= 1 || loading}
          >
            Previous
          </button>

          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="nav-btn"
            onClick={handleNext}
            disabled={currentPage >= totalPages || loading}
          >
            Next
          </button>
        </div>

        {loading ? (
          <div className="properties-grid">
            {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
              <div key={idx} className="property-card skeleton">
                <div className="property-header">
                  <div className="shimmer shimmer-title" />
                </div>
                <div className="property-details">
                  {Array.from({ length: 4 }).map((__, i) => (
                    <div key={i} className="shimmer shimmer-row" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="properties-grid">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>
        ) : (
          <div className="no-properties">
            <FaBuilding size={48} />
            <p>No properties found</p>
          </div>
        )}

        <div className="controls bottom-controls">
          <button
            className="nav-btn"
            onClick={handlePrevious}
            disabled={currentPage <= 1 || loading}
          >
            Previous
          </button>

          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="nav-btn"
            onClick={handleNext}
            disabled={currentPage >= totalPages || loading}
          >
            Next
          </button>
        </div>

        {showDeleteModal && propertyToDelete && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Confirm Deletion</h2>
              <p>
                Are you sure you want to permanently delete{" "}
                <strong>{propertyToDelete.name}</strong>? This action cannot be
                undone.
              </p>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                >
                  Cancel
                </button>

                <button
                  className="delete-confirm-btn"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}