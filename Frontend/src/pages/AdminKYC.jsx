import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import "./AdminKYC.css";
import api from "../api/axios";
import {
  FaUserCheck,
  FaFileUpload,
  FaIdCard,
  FaPhoneAlt,
  FaEnvelope,
  FaUniversity,
  FaCreditCard
} from "react-icons/fa";

export default function AdminKYC() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    bankName: "",
    accountNumber: ""
  });

  const [idDocument, setIdDocument] = useState(null);
  const [ownershipDocument, setOwnershipDocument] = useState(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previews, setPreviews] = useState({
    idDocument: null,
    ownershipDocument: null
  });

  // Get current KYC status on mount
  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      const res = await api.get("/kyc/my-status");
      setStatus(res.data?.status || "Not Submitted");
    } catch (err) {
      console.error("Failed to fetch KYC status:", err);
      setStatus("Not Submitted");
    }
  };

  // Generate preview for ID document
  useEffect(() => {
    if (idDocument) {
      const url = URL.createObjectURL(idDocument);
      setPreviews(prev => ({ ...prev, idDocument: url }));
      return () => URL.revokeObjectURL(url);
    }
  }, [idDocument]);

  // Generate preview for ownership document
  useEffect(() => {
    if (ownershipDocument) {
      const url = URL.createObjectURL(ownershipDocument);
      setPreviews(prev => ({ ...prev, ownershipDocument: url }));
      return () => URL.revokeObjectURL(url);
    }
  }, [ownershipDocument]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed: JPG, PNG, WebP, PDF, DOC, DOCX`);
      return;
    }

    setError("");
    if (fileType === "id") {
      setIdDocument(file);
    } else if (fileType === "ownership") {
      setOwnershipDocument(file);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    // Validate form fields
    if (!form.fullName || !form.email || !form.phone || !form.address || !form.bankName || !form.accountNumber) {
      setError("Please fill all fields including bank details");
      return;
    }

    // Validate files
    if (!idDocument) {
      setError("Please upload ID Document");
      return;
    }

    if (!ownershipDocument) {
      setError("Please upload Ownership Document");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    const data = new FormData();
    data.append("fullName", form.fullName);
    data.append("email", form.email);
    data.append("phone", form.phone);
    data.append("address", form.address);
    data.append("bankName", form.bankName);
    data.append("accountNumber", form.accountNumber);
    data.append("idDocument", idDocument);
    data.append("ownershipDocument", ownershipDocument);

    try {
      setUploading(true);
      const res = await api.post("/kyc/submit", data, { 
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      setSuccess(res.data?.message || "KYC submitted successfully");
      setStatus("Pending");
      
      // Reset form
      setForm({ fullName: "", email: "", phone: "", address: "", bankName: "", accountNumber: "" });
      setIdDocument(null);
      setOwnershipDocument(null);
      setPreviews({ idDocument: null, ownershipDocument: null });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "KYC submission failed";
      setError(errorMsg);
      console.error("KYC submission error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="kyc-page">
        <h2 className="kyc-title">Owners KYC Verification</h2>
        <p className="kyc-subtitle">
          Status: <strong>{status || "Not Submitted"}</strong>
        </p>

        {/* Error Message */}
        {error && (
          <div className="kyc-alert error-alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="kyc-alert success-alert">
            <strong>Success:</strong> {success}
          </div>
        )}

        <div className="kyc-form-card">

          <h3 className="section-title">
            <FaUserCheck /> Owner Information
          </h3>

          <div className="form-grid">

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter full name"
                value={form.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon">
                <FaEnvelope />
                <input
                  type="email"
                  name="email"
                  placeholder="username@domain.com"
                  value={form.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-icon">
                <FaPhoneAlt />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+234 812 345 6789"
                  value={form.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Residential Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter home address"
                value={form.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Bank Name</label>
              <div className="input-icon">
                <FaUniversity />
                <input
                  type="text"
                  name="bankName"
                  placeholder="e.g., First Bank, UBA, Guaranty Trust"
                  value={form.bankName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Account Number</label>
              <div className="input-icon">
                <FaCreditCard />
                <input
                  type="text"
                  name="accountNumber"
                  placeholder="Enter bank account number"
                  value={form.accountNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <h3 className="section-title" style={{ marginTop: "2rem" }}>
            <FaIdCard /> Verification Documents
          </h3>

          <div className="upload-section">

            {/* ID DOCUMENT UPLOAD */}
            <div className="upload-box">
              <label htmlFor="idDocumentInput" style={{ cursor: "pointer", display: "block", width: "100%", height: "100%" }}>
                <FaFileUpload className="upload-icon" />
                {uploading && !previews.idDocument && (
                  <div className="spinner"></div>
                )}
                {previews.idDocument && (
                  <img
                    src={previews.idDocument}
                    alt="ID Preview"
                    className="preview-img"
                  />
                )}
                {!previews.idDocument && !uploading && (
                  <>
                    <p>Click to upload ID Document</p>
                    <span>National ID / Passport / Driver's License</span>
                  </>
                )}
              </label>
              <input 
                id="idDocumentInput"
                type="file" 
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e, "id")}
                style={{ display: "none" }}
              />
            </div>

            {/* OWNERSHIP DOCUMENT UPLOAD */}
            <div className="upload-box">
              <label htmlFor="ownershipDocumentInput" style={{ cursor: "pointer", display: "block", width: "100%", height: "100%" }}>
                <FaFileUpload className="upload-icon" />
                {uploading && !previews.ownershipDocument && (
                  <div className="spinner"></div>
                )}
                {previews.ownershipDocument && (
                  <img
                    src={previews.ownershipDocument}
                    alt="Ownership Preview"
                    className="preview-img"
                  />
                )}
                {!previews.ownershipDocument && !uploading && (
                  <>
                    <p>Upload Proof of Ownership</p>
                    <span>Property document, C of O, Deed</span>
                  </>
                )}
              </label>
              <input 
                id="ownershipDocumentInput"
                type="file" 
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e, "ownership")}
                style={{ display: "none" }}
              />
            </div>

          </div>

          <button 
            className="submit-btn" 
            onClick={handleSubmit} 
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Submit KYC for Review"}
          </button>

        </div>
      </div>
    </AdminLayout>
  );
}