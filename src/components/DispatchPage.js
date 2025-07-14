import React, { useEffect, useState } from 'react';

const DispatchPage = () => {
  const [transformers, setTransformers] = useState([]);
  const vendorCode = localStorage.getItem('vendorCode');

  useEffect(() => {
    fetchTransformers();
  }, []);

  const fetchTransformers = async () => {
    try {
      const res = await fetch(`http://localhost:5000/get-transformers/${vendorCode}`);
      const data = await res.json();
      if (res.ok) setTransformers(data.transformers);
    } catch (err) {
      console.error(err);
      alert("Error fetching transformers");
    }
  };

  const markAsReady = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/update-transformer-status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Ready for Dispatch' })
      });
      if (res.ok) {
        const data = await res.json();
        setTransformers(prev =>
          prev.map(t => (t._id === id ? { ...t, status: data.transformer.status } : t))
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Dispatch Clearance</h2>
      <ul>
        {transformers.map((t, index) => (
          <li key={index}>
            <strong>{t.transformerName}</strong> | {t.capacity} | {t.voltage} | {t.condition}<br />
            <small>Transformer ID: {t.transformerId} | Status: {t.status}</small><br />
            {t.status !== 'Ready for Dispatch' && (
              <button onClick={() => markAsReady(t._id)}>Mark as Ready</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DispatchPage;
