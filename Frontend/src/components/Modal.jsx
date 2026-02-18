import React from "react";
import { IoClose } from "react-icons/io5";
import { FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";
import "./Modal.css";

export default function Modal({ isOpen, title, message, type = "info", onClose, autoCloseTime = null }) {
  React.useEffect(() => {
    if (!isOpen || !autoCloseTime) return;
    
    const timer = setTimeout(() => {
      onClose();
    }, autoCloseTime);

    return () => clearTimeout(timer);
  }, [isOpen, autoCloseTime, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="modal-icon success-icon" />;
      case "error":
        return <FiAlertCircle className="modal-icon error-icon" />;
      case "info":
        return <FiInfo className="modal-icon info-icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <IoClose size={24} />
        </button>

        <div className="modal-icon-wrapper">
          {getIcon()}
        </div>

        {title && <h2 className="modal-title">{title}</h2>}
        
        <p className="modal-message">{message}</p>

        <button className="modal-btn" onClick={onClose}>
          Okay
        </button>
      </div>
    </div>
  );
}
