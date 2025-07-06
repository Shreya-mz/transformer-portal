// models/PaymentRequest.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  vendorId: String,
  transformerId: String,
  amount: String,
  remarks: String,
  status: { type: String, default: "Pending" }
});

const PaymentRequest = mongoose.model('PaymentRequest', paymentSchema);
module.exports = PaymentRequest;
