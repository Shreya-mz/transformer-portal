const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB connection (with filled-in credentials)
mongoose.connect('mongodb+srv://mzshreya007:Shreya07@cluster0.9wyvsy5.mongodb.net/transformerDB?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Vendor schema
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
});
const Vendor = mongoose.model('Vendor', vendorSchema);

// ✅ Transformer schema
const transformerSchema = new mongoose.Schema({
  vendorId: String,
  transformerId: String,
  customerId: String,
  make: String,
  capacity: String,
  oil: String,
  serialNumber: String,
  remarks: String,
  oilDrums: String,
  oilDrumQty: String
}, { timestamps: true });
const Transformer = mongoose.model('Transformer', transformerSchema);

// ✅ Payment Request schema
const paymentSchema = new mongoose.Schema({
  vendorId: String,
  transformerId: String,
  amount: String,
  paymentMode: String,
  status: { type: String, default: 'Pending' }
});
const PaymentRequest = mongoose.model('PaymentRequest', paymentSchema);

// ✅ Register vendor
let customerCounter = 1000000000;
app.post('/register-vendor', async (req, res) => {
  try {
    const {
      organisationName, gstin, address, email,
      contactPersonName, contactMobile, contactEmail, password
    } = req.body;

    const vendorCode = 'VEND-' + Math.floor(1000 + Math.random() * 9000);
    const customerId = (customerCounter++).toString().padStart(10, '0');

    const newVendor = new Vendor({
      organisationName, gstin, address, email,
      contactPersonName, contactMobile, contactEmail,
      password, vendorCode, customerId
    });

    await newVendor.save();
    res.status(201).json({ message: 'Vendor registered', vendorCode, customerId });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ✅ Vendor login
app.post('/login-vendor', async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ contactEmail: email });
    if (!vendor || vendor.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.status(200).json({
      vendorCode: vendor.vendorCode,
      customerId: vendor.customerId
    });
  } catch (err) {
    res.status(500).json({ error: 'Login error' });
  }
});

// ✅ Add transformer
app.post('/add-transformer', async (req, res) => {
  try {
    const {
      vendorId, make, capacity, oil, serialNumber,
      remarks, oilDrums, oilDrumQty
    } = req.body;

    const vendor = await Vendor.findOne({ vendorCode: vendorId });
    const customerId = vendor?.customerId || '';
    const transformerId = customerId.substring(0, 4).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);

    const newTransformer = new Transformer({
      vendorId,
      transformerId,
      customerId,
      make,
      capacity,
      oil,
      serialNumber,
      remarks,
      oilDrums,
      oilDrumQty
    });

    await newTransformer.save();
    res.status(201).json({ message: 'Transformer added', transformer: newTransformer });
  } catch (err) {
    res.status(500).json({ error: 'Add transformer failed' });
  }
});

// ✅ Get transformers
app.get('/get-transformers/:vendorId', async (req, res) => {
  try {
    const transformers = await Transformer.find({ vendorId: req.params.vendorId });
    res.json({ transformers });
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// ✅ Delete transformer
app.delete('/delete-transformer/:id', async (req, res) => {
  try {
    await Transformer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// ✅ Submit payment request
app.post('/submit-payment', async (req, res) => {
  try {
    const { vendorId, transformerId, amount, paymentMode } = req.body;
    const newRequest = new PaymentRequest({ vendorId, transformerId, amount, paymentMode });
    await newRequest.save();
    res.status(201).json({ message: 'Payment request sent' });
  } catch (err) {
    res.status(500).json({ error: 'Submit failed' });
  }
});

// ✅ Approve request
app.patch('/approve-request/:id', async (req, res) => {
  try {
    await PaymentRequest.findByIdAndUpdate(req.params.id, { status: 'Approved' });
    res.json({ message: 'Approved' });
  } catch (err) {
    res.status(500).json({ error: 'Approval failed' });
  }
});

// ✅ Get all payment requests
app.get('/get-payment-requests', async (req, res) => {
  try {
    const requests = await PaymentRequest.find();
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
