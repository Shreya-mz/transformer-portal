const mongoose = require('mongoose');

const transformerSchema = new mongoose.Schema({
  vendorId: String,
  transformerName: String,
  capacity: String,
  voltage: String,
  condition: String,
  transformerId: String
}, { timestamps: true });

module.exports = mongoose.model('Transformer', transformerSchema);
