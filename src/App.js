// frontend-app/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VendorRegisterForm from './components/VendorRegisterForm';
import VendorLoginForm from './components/VendorLoginForm';
import TransformerForm from './components/TransformerForm';
import PaymentRequestForm from './components/PaymentRequestForm';
import ApprovalRequestForm from './components/ApprovalRequestForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VendorLoginForm />} />
        <Route path="/register" element={<VendorRegisterForm />} />
        <Route path="/transformers" element={<TransformerForm />} />
        <Route path="/payment-request" element={<PaymentRequestForm />} />
        <Route path="/approval-requests" element={<ApprovalRequestForm />} />
      </Routes>
    </Router>
  );
}

export default App;
