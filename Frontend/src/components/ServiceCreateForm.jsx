import React, { useState } from 'react';
import { createService } from '../api/providers.api';

export default function ServiceCreateForm({ providerId, onCreated }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        title,
        category,
        description,
        price: Number(price) || 0,
        estimatedDuration,
      };
      const svc = await createService(providerId, payload);
      setTitle(''); setCategory(''); setDescription(''); setPrice(''); setEstimatedDuration('');
      if (onCreated) onCreated(svc);
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="service-create" onSubmit={submit}>
      <div className="form-row">
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} />
      </div>
      <div className="form-row">
        <input placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} />
        <input placeholder="Estimated duration (e.g. 2h)" value={estimatedDuration} onChange={e=>setEstimatedDuration(e.target.value)} />
      </div>
      <div className="form-row">
        <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      </div>
      {error && <div className="form-error">{error}</div>}
      <button className="btn btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Add Service'}</button>
    </form>
  );
}
