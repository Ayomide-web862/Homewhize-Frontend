import React, { useState } from 'react';
import paymentsApi from '../api/payments.api';

export default function ProceedToPaymentButton({ amount, email, children }) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    try {
      const { data } = await paymentsApi.initializePayment({ amount, email });
      if (data?.authorization_url) {
        // Redirect user to Paystack test checkout
        window.location.href = data.authorization_url;
      } else {
        alert('Failed to initialize payment');
      }
    } catch (err) {
      console.error('Initialize payment error', err);
      alert(err.response?.data?.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Processing...' : children || `Pay ${amount}`}
    </button>
  );
}
