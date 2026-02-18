import React, { useState } from 'react';
import Modal from './Modal';
import paymentsApi from '../api/payments.api';

export default function ProceedToPaymentButton({ amount, email, children }) {
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showModal = (title, message, type = "info") => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const { data } = await paymentsApi.initializePayment({ amount, email });
      if (data?.authorization_url) {
        // Redirect user to Paystack test checkout
        window.location.href = data.authorization_url;
      } else {
        showModal("Payment Error", "Failed to initialize payment", "error");
      }
    } catch (err) {
      console.error('Initialize payment error', err);
      showModal("Payment Error", err.response?.data?.message || 'Payment initialization failed', "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={closeModal}
      />
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Processing...' : children || `Pay ${amount}`}
      </button>
    </>
  );
}
