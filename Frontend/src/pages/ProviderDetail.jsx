import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProviderBySlug } from '../api/providers.api';
import ServiceCreateForm from '../components/ServiceCreateForm';
import './ProviderDetail.css';

export default function ProviderDetail() {
  const { slug } = useParams(); // slug instead of id
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const p = await getProviderBySlug(slug);
        if (mounted) setProvider(p);
      } catch (err) {
        console.error('Failed to load provider', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [slug]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!provider) return <div className="loading">Provider not found</div>;

  return (
    <div className="provider-detail-page">
      <Navbar />
      <div className="provider-detail-container">
        <div className="provider-main">
          <div className="provider-header">
            <div className="provider-avatar-large">
              {provider.company_name?.split(' ').map(w => w[0]).slice(0,2).join('')}
            </div>
            <div>
              <h1>{provider.company_name}</h1>
              <p className="provider-desc">{provider.description}</p>
            </div>
          </div>

          <h2 className="section-title">Services</h2>
          {/* Simple service creation form for provider owners/admins */}
          <div className="service-create-form">
            <h3>Add Service</h3>
            <ServiceCreateForm providerId={provider.id} onCreated={(svc) => {
              // append to local provider.services
              setProvider(prev => ({ ...prev, services: [svc, ...(prev.services||[])] }));
            }} />
          </div>
          <div className="services-list">
            {(provider.services || []).map(s => (
              <div key={s.id} className="service-card-detail">
                <div className="service-info">
                  <div className="service-title">{s.title}</div>
                  <div className="service-desc">{s.description}</div>
                </div>
                <div className="service-price">
                  <div>₦{s.price}</div>
                  <div className="service-duration">{s.estimatedDuration || '—'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="provider-sidebar">
          <h3>Messages</h3>
          <div className="messages-box">Messaging disabled</div>
        </div>
      </div>
    </div>
  );
}