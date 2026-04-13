import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import SuperAdminLayout from "../components/Super-AdminLayout";
import PropertyCard from "../components/PropertyCard";
import "./SuperAdminPropertyManagement.css";
import { FaBuilding } from "react-icons/fa";

export default function SuperAdminPropertyManagement() {
  const PAGE_SIZE = 12;
  const [loadedProperties, setLoadedProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isFetchingRef = useRef(false);

  const fetchPropertiesPage = useCallback(
    async (page) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      const isInitial = page === 1 && loadedProperties.length === 0;
      if (isInitial) {
        setInitialLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      try {
        const api = (await import("../api/axios")).default;
        const { data } = await api.get(`/properties/superadmin/all?page=${page}&limit=${PAGE_SIZE}`);
        const newProperties = Array.isArray(data.properties) ? data.properties : [];
      const resolvedTotalPages = data.totalPages || 1;
      const resolvedPage = Math.min(page, resolvedTotalPages);

      setLoadedProperties((prev) => {
        if (resolvedPage === 1) return newProperties;
        const existingIds = new Set(prev.map((item) => item.id));
        return [...prev, ...newProperties.filter((item) => !existingIds.has(item.id))];
      });

      setTotalPages(resolvedTotalPages);
      setCurrentPage(resolvedPage);
      } catch (fetchError) {
        console.error("Failed to load properties:", fetchError);
        setError("Could not load properties. Please try again later.");
      } finally {
        if (isInitial) setInitialLoading(false);
        else setLoadingMore(false);
        isFetchingRef.current = false;
      }
    },
    [loadedProperties.length]
  );

  useEffect(() => {
    fetchPropertiesPage(1);
  }, [fetchPropertiesPage]);

  const handleOpenDelete = useCallback((property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!propertyToDelete) return;

    setIsDeleting(true);
    setError(null);
    const existingProperties = [...loadedProperties];
    setLoadedProperties((prev) => prev.filter((item) => item.id !== propertyToDelete.id));
    setShowDeleteModal(false);

    try {
      const api = (await import("../api/axios")).default;
      await api.delete(`/properties/${propertyToDelete.id}`);
      await fetchPropertiesPage(currentPage);
    } catch (deleteError) {
      console.error("Delete failed:", deleteError);
      setLoadedProperties(existingProperties);
      setError("Could not delete property, please try again.");
    } finally {
      setIsDeleting(false);
      setPropertyToDelete(null);
    }
  }, [loadedProperties, propertyToDelete, fetchPropertiesPage, currentPage]);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  }, []);

  const hasMore = currentPage < totalPages;

  const onNext = useCallback(() => {
    if (!hasMore) return;
    if (loadedProperties.length >= (currentPage + 1) * PAGE_SIZE) {
      setCurrentPage((prev) => prev + 1);
    } else {
      fetchPropertiesPage(currentPage + 1);
    }
  }, [currentPage, fetchPropertiesPage, hasMore, loadedProperties.length]);

  const sentinelRef = useRef(null);

  useEffect(() => {
    if (loadingMore || initialLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onNext();
        }
      },
      { rootMargin: "200px" }
    );

    const node = sentinelRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [hasMore, initialLoading, loadingMore, onNext]);
  const displayedProperties = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return loadedProperties.slice(start, start + PAGE_SIZE);
  }, [loadedProperties, currentPage]);

  if (initialLoading) {
    return (
      <SuperAdminLayout>
        <div className="loading">Loading properties...</div>
      </SuperAdminLayout>
    );
  }

  if (error) {
    return (
      <SuperAdminLayout>
        <div className="error">{error}</div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="super-admin-property-management">
        <div className="header">
          <h1>Property Management</h1>
          <p>Manage all properties across the platform</p>
        </div>

        <div className="controls">
          <button className="nav-btn" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage <= 1 || initialLoading}>
            Previous
          </button>
          <span className="page-info">Page {currentPage} / {totalPages}</span>
          <button className="nav-btn" onClick={() => onNext()} disabled={!hasMore || initialLoading}>
            Next
          </button>
        </div>

        {displayedProperties.length > 0 ? (
          <>
            <div className="properties-grid">
              {displayedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} onDelete={handleOpenDelete} />
              ))}
            </div>

            <div ref={sentinelRef} style={{ height: "1px" }} />

            {loadingMore && (
              <div className="properties-grid">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="property-card skeleton">
                    <div className="property-header"><div className="shimmer shimmer-title" /></div>
                    <div className="property-details">
                      {Array.from({ length: 4 }).map((__, i) => (
                        <div key={i} className="shimmer shimmer-row" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="no-properties">
            <FaBuilding size={48} />
            <p>No properties found</p>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {showDeleteModal && propertyToDelete && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Confirm Deletion</h2>
              <p>
                Are you sure you want to permanently delete the property "{propertyToDelete.name}"?
                This action cannot be undone.
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