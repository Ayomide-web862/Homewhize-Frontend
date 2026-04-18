import React, { useState, useEffect } from "react";
import ServiceProviderLayout from "../components/ServiceProviderLayout";
import "./ServiceProviderKYC.css";
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

export default function ServiceProviderKYC() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    bankCode: "",
    bankName: "",
    accountNumber: ""
  });

  const [banks, setBanks] = useState([]);
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

  useEffect(() => {
    fetchKYCStatus();
    fetchBanks();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      const res = await api.get("/kyc/my-status");
      setStatus(res.data?.status || "Not Submitted");
    } catch (err) {
      console.error(err);
      setStatus("Not Submitted");
    }
  };

  const fetchBanks = async () => {
    try {
      const res = await api.get("/kyc/banks");
      setBanks(res.data?.banks || []);
    } catch (err) {
      console.error("Failed to fetch banks:", err);
      setError("Failed to load bank list");
    }
  };

  useEffect(() => {
    if (idDocument) {
      const url = URL.createObjectURL(idDocument);
      setPreviews(prev => ({ ...prev, idDocument: url }));
      return () => URL.revokeObjectURL(url);
    }
  }, [idDocument]);

  useEffect(() => {
    if (ownershipDocument) {
      const url = URL.createObjectURL(ownershipDocument);
      setPreviews(prev => ({ ...prev, ownershipDocument: url }));
      return () => URL.revokeObjectURL(url);
    }
  }, [ownershipDocument]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Auto-fill bank name when bank code is selected
    if (name === "bankCode") {
      const selectedBank = banks.find(bank => bank.code === value);
      if (selectedBank) {
        setForm(prev => ({ ...prev, bankName: selectedBank.name, bankCode: value }));
      } else {
        setForm(prev => ({ ...prev, bankName: "", bankCode: value }));
      }
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setError("");
    if (fileType === "id") setIdDocument(file);
    if (fileType === "ownership") setOwnershipDocument(file);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!form.fullName || !form.email || !form.phone || !form.address || !form.bankCode || !form.accountNumber) {
      setError("Please fill all fields");
      return;
    }

    if (!/^\d+$/.test(form.bankCode)) {
      setError("Please select a valid bank");
      return;
    }

    if (!idDocument || !ownershipDocument) {
      setError("Please upload required documents");
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    data.append("idDocument", idDocument);
    data.append("ownershipDocument", ownershipDocument);

    try {
      setUploading(true);
      const res = await api.post("/kyc/submit", data);
      setSuccess(res.data?.message || "KYC submitted successfully");
      setStatus("Pending");

      setForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        bankCode: "",
        bankName: "",
        accountNumber: ""
      });
      setIdDocument(null);
      setOwnershipDocument(null);
      setPreviews({ idDocument: null, ownershipDocument: null });

    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ServiceProviderLayout>
      <div className="sp-kyc-page">
        <h2 className="sp-kyc-title">Service Provider KYC Verification</h2>

        <p className="sp-kyc-subtitle">
          Status: <strong>{status}</strong>
        </p>

        {error && (
          <div className="sp-kyc-alert sp-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="sp-kyc-alert sp-success">
            <strong>Success:</strong> {success}
          </div>
        )}

        <div className="sp-kyc-form-card">

          <h3 className="sp-section-title">
            <FaUserCheck /> Provider Information
          </h3>

          <div className="sp-form-grid">

            <div className="sp-form-group">
              <label>Full Name / Business Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter full name"
                value={form.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="sp-form-group">
              <label>Email</label>
              <div className="sp-input-icon">
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

            <div className="sp-form-group">
              <label>Phone</label>
              <div className="sp-input-icon">
                <FaPhoneAlt />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+234 800 000 0000"
                  value={form.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="sp-form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter full address"
                value={form.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="sp-form-group">
              <label>Select Bank</label>
              <div className="sp-input-icon">
                <FaUniversity />
                <select
                  name="bankCode"
                  value={form.bankCode}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}
                >
                  <option value="">Select your bank</option>
                  {banks.map(bank => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sp-form-group">
              <label>Account Number</label>
              <div className="sp-input-icon">
                <FaCreditCard />
                <input
                  name="accountNumber"
                  placeholder="Enter account number"
                  value={form.accountNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>

          </div>

          <h3 className="sp-section-title" style={{ marginTop: "2rem" }}>
            <FaIdCard /> Verification Documents
          </h3>

          <div className="sp-upload-section">

            <div className="sp-upload-box">
              <label htmlFor="idDocumentInput" style={{ cursor: "pointer", display: "block", width: "100%", height: "100%" }}>
                <FaFileUpload className="sp-upload-icon" />

                {uploading && !previews.idDocument && (
                  <div className="sp-spinner"></div>
                )}

                {previews.idDocument && (
                  <div className="sp-file-preview-container">
                    <img src={previews.idDocument} alt="ID Preview" className="sp-preview-img" />
                    <button
                      type="button"
                      className="sp-remove-file-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIdDocument(null);
                        setPreviews(prev => ({ ...prev, idDocument: null }));
                      }}
                      title="Remove file"
                    >
                      ×
                    </button>
                    <div className="sp-file-info">
                      <span className="sp-file-name">{idDocument?.name}</span>
                      <span className="sp-file-size">({(idDocument?.size / 1024 / 1024).toFixed(1)} MB)</span>
                    </div>
                  </div>
                )}

                {!previews.idDocument && !uploading && (
                  <>
                    <p>Upload ID Document</p>
                    <span>NIN / Passport / Driver's License</span>
                    <small>JPG, PNG, WebP, PDF, DOC, DOCX (Max 10MB)</small>
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

            <div className="sp-upload-box">
              <label htmlFor="ownershipDocumentInput" style={{ cursor: "pointer", display: "block", width: "100%", height: "100%" }}>
                <FaFileUpload className="sp-upload-icon" />

                {uploading && !previews.ownershipDocument && (
                  <div className="sp-spinner"></div>
                )}

                {previews.ownershipDocument && (
                  <div className="sp-file-preview-container">
                    <img src={previews.ownershipDocument} alt="Business Document Preview" className="sp-preview-img" />
                    <button
                      type="button"
                      className="sp-remove-file-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOwnershipDocument(null);
                        setPreviews(prev => ({ ...prev, ownershipDocument: null }));
                      }}
                      title="Remove file"
                    >
                      ×
                    </button>
                    <div className="sp-file-info">
                      <span className="sp-file-name">{ownershipDocument?.name}</span>
                      <span className="sp-file-size">({(ownershipDocument?.size / 1024 / 1024).toFixed(1)} MB)</span>
                    </div>
                  </div>
                )}

                {!previews.ownershipDocument && !uploading && (
                  <>
                    <p>Upload Business Document</p>
                    <span>CAC, C of O, Deed</span>
                    <small>JPG, PNG, WebP, PDF, DOC, DOCX (Max 10MB)</small>
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
            className="sp-submit-btn"
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Submit for Review"}
          </button>

        </div>
      </div>
    </ServiceProviderLayout>
  );
}