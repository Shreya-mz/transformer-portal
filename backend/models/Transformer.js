const mongoose = require('mongoose');

const transformerSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  transformerName: {
    type: String,
    required: true
  },
  capacity: {
    type: String,
    required: true
  },
  voltage: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  receivedDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transformer', transformerSchema);
