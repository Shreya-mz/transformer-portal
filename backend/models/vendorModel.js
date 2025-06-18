const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  organisationName: String,
  gstin: String,
  address: String,
  email: String,
  contactPersonName: String,
  contactMobile: String,
  contactEmail: String,
  password: String, // For login (we can hash later)
  vendorCode: String, // Unique Vendor Code
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
