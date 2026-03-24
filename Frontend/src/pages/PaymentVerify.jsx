import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { verifyPayment } from '../api/payments.api';

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (!reference) {
      setStatus('error');
      setMessage('No payment reference provided.');
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const res = await verifyPayment(reference);
        if (!mounted) return;
        if (res.data && res.data.verified) {
          setStatus('success');
          setMessage('Payment verified successfully! Your booking has been confirmed and a confirmation email has been sent.');
          setTimeout(() => navigate('/dashboard'), 3000);
        } else {
          setStatus('failed');
          setMessage('Payment could not be verified.');
        }
      } catch (err) {
        console.error('verify error', err);
        if (!mounted) return;
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed');
      }
    })();

    return () => { mounted = false; };
  }, [searchParams, navigate]);

  return (
    <div>
      <Navbar />
      <div style={{maxWidth:900, margin:'40px auto', padding:20, textAlign:'center'}}>
        <h2>Payment Status</h2>
        <p>{message}</p>
        {status === 'verifying' && <p>Verifying...</p>}
      </div>
    </div>
  );
}
