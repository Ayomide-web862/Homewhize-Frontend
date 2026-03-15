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

  useEffect(() => {
    fetchKYCStatus();
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

    if (!form.fullName || !form.email || !form.phone || !form.address || !form.bankName || !form.accountNumber) {
      setError("Please fill all fields");
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
              <label>Bank</label>
              <div className="sp-input-icon">
                <FaUniversity />
                <input
                  name="bankName"
                  placeholder="Enter bank name"
                  value={form.bankName}
                  onChange={handleInputChange}
                />
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
              <label htmlFor="idDocumentInput">
                <FaFileUpload className="sp-upload-icon" />

                {previews.idDocument && (
                  <img src={previews.idDocument} alt="" className="sp-preview-img" />
                )}

                {!previews.idDocument && (
                  <>
                    <p>Upload ID Document</p>
                    <span>NIN / Passport / Driver's License</span>
                  </>
                )}
              </label>

              <input
                id="idDocumentInput"
                type="file"
                onChange={(e) => handleFileChange(e, "id")}
                hidden
              />
            </div>

            <div className="sp-upload-box">
              <label htmlFor="ownershipDocumentInput">
                <FaFileUpload className="sp-upload-icon" />

                {previews.ownershipDocument && (
                  <img src={previews.ownershipDocument} alt="" className="sp-preview-img" />
                )}

                {!previews.ownershipDocument && (
                  <>
                    <p>Upload Business Document</p>
                    <span>CAC, C of O, Deed</span>
                  </>
                )}
              </label>

              <input
                id="ownershipDocumentInput"
                type="file"
                onChange={(e) => handleFileChange(e, "ownership")}
                hidden
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