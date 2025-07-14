// frontend-app/src/components/DispatchForm.js
import React, { useState } from 'react';
import './styles.css';

const DispatchForm = () => {
  const [dispatchData, setDispatchData] = useState({
    transformerId: '',
    driverName: '',
    vehicleNumber: '',
    invoiceNumber: '',
    expectedArrival: '',
    dispatchDate: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setDispatchData({ ...dispatchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/submit-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dispatchData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Dispatch details submitted successfully!');
        setDispatchData({
          transformerId: '',
          driverName: '',
          vehicleNumber: '',
          invoiceNumber: '',
          expectedArrival: '',
          dispatchDate: ''
        });
      } else {
        setMessage(data.error || '❌ Failed to submit dispatch info.');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error submitting dispatch info.');
    }
  };

  return (
    <div className="form-box">
      <h2>Dispatch Details</h2>
      <form onSubmit={handleSubmit}>
        <input name="transformerId" placeholder="Transformer ID" value={dispatchData.transformerId} onChange={handleChange} required />
        <input name="driverName" placeholder="Driver Name" value={dispatchData.driverName} onChange={handleChange} required />
        <input name="vehicleNumber" placeholder="Vehicle Number" value={dispatchData.vehicleNumber} onChange={handleChange} required />
        <input name="invoiceNumber" placeholder="Invoice Number" value={dispatchData.invoiceNumber} onChange={handleChange} required />
        <input type="date" name="dispatchDate" value={dispatchData.dispatchDate} onChange={handleChange} required />
        <input type="date" name="expectedArrival" value={dispatchData.expectedArrival} onChange={handleChange} required />
        <button type="submit">Submit Dispatch</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DispatchForm;
