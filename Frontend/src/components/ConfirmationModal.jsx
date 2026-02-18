import React from "react";
import { IoClose } from "react-icons/io5";
import { FiAlertCircle, FiTrash2 } from "react-icons/fi";
import "./ConfirmationModal.css";

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  onConfirm,
  onCancel,
  isLoading = false,
  isDangerous = false,
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
      case "delete":
        return <FiTrash2 className="modal-icon danger-icon" />;
      case "warning":
        return <FiAlertCircle className="modal-icon warning-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="confirmation-modal-overlay" onClick={onCancel}>
      <div className="confirmation-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="confirmation-modal-close-btn" onClick={onCancel}>
          <IoClose size={24} />
        </button>

        <div className="confirmation-modal-icon-wrapper">
          {getIcon()}
        </div>

        {title && <h2 className="confirmation-modal-title">{title}</h2>}

        <p className="confirmation-modal-message">{message}</p>

        <div className="confirmation-modal-actions">
          <button
            className="confirmation-modal-btn cancel-btn"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`confirmation-modal-btn confirm-btn ${
              isDangerous ? "danger" : ""
            }`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
