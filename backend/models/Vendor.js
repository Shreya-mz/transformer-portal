const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  organisationName: String,
  gstin: String,
  address: String,
  email: String,
  contactPersonName: String,
  contactPersonMobile: String,
  contactPersonEmail: String,
  vendorCode: String // Will be generated during registration
});

module.exports = mongoose.model('Vendor', vendorSchema);
