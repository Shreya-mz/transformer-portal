import React, { useState } from 'react';
import './styles.css';

const TreatmentValidationForm = () => {
  const [formData, setFormData] = useState({
    transformerId: '',
    validatedBy1: '',
    validatedBy2: '',
    treatmentStatus: 'Validated'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/validate-treatment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Treatment validated successfully!');
        setFormData({
          transformerId: '',
          validatedBy1: '',
          validatedBy2: '',
          treatmentStatus: 'Validated'
        });
      } else {
        setMessage(data.error || '❌ Validation failed.');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error during validation.');
    }
  };

  return (
    <div className="form-box">
      <h2>Treatment Validation</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="transformerId"
          placeholder="Transformer ID"
          value={formData.transformerId}
          onChange={handleChange}
          required
        />
        <input
          name="validatedBy1"
          placeholder="Validated By (Person 1)"
          value={formData.validatedBy1}
          onChange={handleChange}
          required
        />
        <input
          name="validatedBy2"
          placeholder="Validated By (Person 2)"
          value={formData.validatedBy2}
          onChange={handleChange}
          required
        />
        <button type="submit">Validate Treatment</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TreatmentValidationForm;
