// frontend-app/src/components/VendorRegisterForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const VendorRegisterForm = () => {
  const [formData, setFormData] = useState({
    organisationName: '',
    gstin: '',
    address: '',
    email: '',
    contactPersonName: '',
    contactMobile: '',
    contactEmail: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/register-vendor', {
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
      alert(data.error || 'Registration failed');
    }
  };

  return (
    <div className="form-box">
      <h2>Vendor Registration</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            onChange={handleChange}
            required
          />
        ))}
        <button type="submit">Register</button>
      </form>
      <p>Already registered? <a href="/">Login here</a></p>
    </div>
  );
};

export default VendorRegisterForm;
