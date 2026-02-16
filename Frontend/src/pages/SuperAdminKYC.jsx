import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../components/Super-AdminLayout";
import "./SuperAdminKYC.css";
import api from "../api/axios";
import { FaEye, FaCheckCircle, FaTimesCircle, FaDownload } from "react-icons/fa";

export default function SuperAdminKYC() {
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchKYC();
  }, []);

  const fetchKYC = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await api.get("/kyc/all");

      // Handle both possible response shapes
      const ownersArray = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      setOwners(ownersArray);
    } catch (error) {
      console.error("Failed to fetch KYC:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch KYC submissions";
      setError(errorMsg);
      setOwners([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    if (!id || !status) {
      alert("Invalid KYC ID or status");
      return;
    }

    try {
      setUpdating(id);
      const res = await api.put(`/kyc/${id}/status`, { status });

      alert(`KYC ${status} successfully`);
      await fetchKYC();
    } catch (err) {
      const errorMsg = err.response?.data?.message || `Failed to ${status} KYC`;
      alert(errorMsg);
      console.error("Update KYC status error:", err);
    } finally {
      setUpdating(null);
    }
  };

const downloadFile = async (id, type) => {
  try {
    // First, ask backend for a signed URL we can open in a new tab.
    const res = await api.get(`/kyc/signed-url/${id}/${type}`);
    const signed = res?.data?.url;
    if (!signed) throw new Error("No signed URL returned");

    // Open signed URL in a new tab — top-level navigation avoids CORS/XHR issues.
    window.open(signed, "_blank");
  } catch (err) {
    console.error("Download failed:", err);
    // Fallback: open the direct Cloudinary URL in a new tab so the browser can handle the download.
    console.warn("Attempting fallback direct URL open for download.");
    try {
      const owner = owners.find(o => o.id === id);
      const direct = type === "id" ? owner?.id_document_url : owner?.ownership_document_url;
      if (direct) {
        window.open(direct, "_blank");
        return;
      }
    } catch (e) {
      console.error("Fallback failed:", e);
    }
    alert("Download failed");
  }
};



  // Filter owners based on status
  const filteredOwners = filter === "All" 
    ? owners 
    : owners.filter(owner => owner.status === filter);

  return (
    <SuperAdminLayout>
      <div className="kyc-container">

        <div className="kyc-header">
          <div>
            <h1 className="kyc-title">Owners KYC Verification</h1>
            <p className="kyc-subtitle">
              Review and verify all shortlet owners onboarding. ({filteredOwners.length} submissions)
            </p>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="kyc-alert error-alert">
            <strong>Error:</strong> {error}
            <button onClick={fetchKYC} style={{ marginLeft: "1rem" }}>
              Retry
            </button>
          </div>
        )}

        {/* FILTER TABS */}
        <div className="kyc-filter-tabs">
          {["All", "Pending", "Approved", "Rejected"].map(status => (
            <button
              key={status}
              className={`filter-tab ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {/* LOADING STATE */}
        {loading && <p className="kyc-loading">Loading KYC submissions...</p>}

        {/* EMPTY STATE */}
        {!loading && filteredOwners.length === 0 && (
          <p className="kyc-empty">
            {filter === "All" 
              ? "No KYC submissions found." 
              : `No ${filter} KYC submissions found.`}
          </p>
        )}

        {/* KYC CARDS */}
        {!loading && filteredOwners.length > 0 && (
          <div className="kyc-grid">
            {filteredOwners.map((owner) => (
              <div key={owner.id} className="kyc-card">

                <div className="kyc-card-header">
                  <h3>{owner.full_name || "Unknown"}</h3>
                  <span className={`kyc-status ${(owner.status || "Pending").toLowerCase()}`}>
                    {owner.status || "Pending"}
                  </span>
                </div>

                <p className="kyc-info">
                  <strong>Email:</strong> {owner.email || "N/A"}
                </p>
                <p className="kyc-info">
                  <strong>Phone:</strong> {owner.phone || "N/A"}
                </p>
                <p className="kyc-info">
                  <strong>Address:</strong> {owner.address ? owner.address.substring(0, 40) + "..." : "N/A"}
                </p>

                <div className="kyc-actions">
                  <button
                    className="view-btn"
                    onClick={() => setSelectedOwner(owner)}
                    title="View documents"
                  >
                    <FaEye /> View
                  </button>

                  <button
                    className="approve-btn"
                    onClick={() => updateStatus(owner.id, "Approved")}
                    disabled={owner.status === "Approved" || updating === owner.id}
                    title="Approve KYC"
                  >
                    {updating === owner.id ? "..." : <><FaCheckCircle /> Approve</>}
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => updateStatus(owner.id, "Rejected")}
                    disabled={owner.status === "Rejected" || updating === owner.id}
                    title="Reject KYC"
                  >
                    {updating === owner.id ? "..." : <><FaTimesCircle /> Reject</>}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* MODAL */}
        {selectedOwner && (
          <div className="kyc-modal" onClick={() => setSelectedOwner(null)}>
            <div className="kyc-modal-content" onClick={(e) => e.stopPropagation()}>
              <span
                className="close-modal"
                onClick={() => setSelectedOwner(null)}
                title="Close"
              >
                &times;
              </span>

              <h2>{selectedOwner.full_name}</h2>
              <p><strong>Email:</strong> {selectedOwner.email}</p>
              <p><strong>Phone:</strong> {selectedOwner.phone}</p>
              <p><strong>Address:</strong> {selectedOwner.address}</p>
              <p><strong>Bank Name:</strong> {selectedOwner.bank_name || "N/A"}</p>
              <p><strong>Account Number:</strong> {selectedOwner.account_number || "N/A"}</p>
              <p><strong>Status:</strong> <span className={`kyc-status ${(selectedOwner.status || "Pending").toLowerCase()}`}>{selectedOwner.status || "Pending"}</span></p>

              <div className="kyc-modal-documents">
                <div className="modal-doc">
                  <h4>ID Document</h4>
                  {selectedOwner.id_document_url ? (
                    <>
                      {selectedOwner.id_document_url.includes('.pdf') ? (
                        <div className="doc-preview-pdf">
                          <p>PDF Document</p>
                          <button onClick={() => downloadFile(selectedOwner.id, "id")} download className="doc-download-link">
                            <FaDownload /> Download
                          </button>

                        </div>
                      ) : (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}/kyc/download/${selectedOwner.id}/id`}
                          alt="ID Document"
                          className="kyc-modal-img"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                      )}
                      <p className="doc-error" style={{ display: "none" }}>
                        Failed to load document. 
                        <button onClick={() => downloadFile(selectedOwner.id, "id")}>
                          <FaDownload /> Download PDF
                        </button>
                      </p>
                    </>
                  ) : (
                    <p>No document uploaded</p>
                  )}
                </div>

                <div className="modal-doc">
                  <h4>Ownership Document</h4>
                  {selectedOwner.ownership_document_url ? (
                    <>
                      {selectedOwner.ownership_document_url.includes('.pdf') ? (
                        <div className="doc-preview-pdf">
                          <p>PDF Document</p>
                          <button onClick={() => downloadFile(selectedOwner.id, "ownership")} download className="doc-download-link">
                            <FaDownload /> Download
                          </button>

                        </div>
                      ) : (
                        <img
                          src={`/api/kyc/download/${selectedOwner.id}/ownership`}
                          alt="Ownership Document"
                          className="kyc-modal-img"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                      )}
                      {/* <p className="doc-error" style={{ display: "none" }}>
                        <button onClick={() => downloadFile(selectedOwner.id, "ownership")} download className="doc-download-link">
                          <FaDownload /> Download
                        </button>
                      </p> */}
                    </>
                  ) : (
                    <p>No document uploaded</p>
                  )}
                </div>
              </div>

              <div className="kyc-modal-actions">
                <button
                  className="approve-btn"
                  onClick={() => {
                    updateStatus(selectedOwner.id, "Approved");
                    setSelectedOwner(null);
                  }}
                  disabled={selectedOwner.status === "Approved" || updating === selectedOwner.id}
                >
                  <FaCheckCircle /> Approve
                </button>

                <button
                  className="reject-btn"
                  onClick={() => {
                    updateStatus(selectedOwner.id, "Rejected");
                    setSelectedOwner(null);
                  }}
                  disabled={selectedOwner.status === "Rejected" || updating === selectedOwner.id}
                >
                  <FaTimesCircle /> Reject
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </SuperAdminLayout>
  );
}


