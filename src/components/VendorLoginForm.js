// frontend-app/src/components/VendorLoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const VendorLoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('https://transformer-backend-uhsn.onrender.com/login-vendor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('vendorId', data.vendorCode);
      localStorage.setItem('customerId', data.customerId);
      navigate('/transformers');
    } else {
      alert(data.error || 'Login failed');
    }
  };

  return (
    <div className="form-box">
      <h2>Vendor Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p>Not registered? <a href="/register">Register here</a></p>
    </div>
  );
};

export default VendorLoginForm;
