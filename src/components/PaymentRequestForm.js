// frontend-app/src/components/PaymentRequestForm.js
import React, { useState } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';

const PaymentRequestForm = () => {
  const [paymentData, setPaymentData] = useState({
    vendorId: localStorage.getItem('vendorId') || '',
    transformerId: '',
    amount: '',
    remarks: '',
    paymentMode: 'Online'
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/submit-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Payment request submitted successfully!');
        setPaymentData({
          ...paymentData,
          transformerId: '',
          amount: '',
          remarks: ''
        });
      } else {
        setMessage(data.error || '❌ Failed to submit payment request.');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error submitting payment request.');
    }
  };

  const handleNext = () => {
    navigate('/approval-requests');
  };

  return (
    <div className="form-box">
      <h2>Payment Request</h2>
      <form onSubmit={handleSubmit}>
        <input name="transformerId" placeholder="Transformer ID" value={paymentData.transformerId} onChange={handleChange} required />
        <input name="amount" placeholder="Amount (in ₹)" value={paymentData.amount} onChange={handleChange} required />
        <input name="remarks" placeholder="Remarks" value={paymentData.remarks} onChange={handleChange} />
        <select name="paymentMode" value={paymentData.paymentMode} onChange={handleChange}>
          <option value="Online">Online</option>
          <option value="NEFT">NEFT</option>
          <option value="UPI">UPI</option>
        </select>
        <button type="submit">Request Payment</button>
      </form>
      {message && <p>{message}</p>}

      <button onClick={handleNext} style={{ marginTop: '20px' }}>Next</button>
    </div>
  );
};

export default PaymentRequestForm;
