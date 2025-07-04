const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  organisationName: String,
  gstin: String,
  address: String,
  email: String,
  contactPersonName: String,
  contactMobile: String,
  contactEmail: String,
  password: String,
  vendorCode: String,
  customerId: String
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
