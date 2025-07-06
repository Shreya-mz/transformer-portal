const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB connection
mongoose.connect('mongodb+srv://mzshreya007:Shreya07@cluster0.9wyvsy5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Vendor Schema & Model
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

// ✅ Transformer Schema & Model
const transformerSchema = new mongoose.Schema({
  vendorId: String,
  transformerName: String,
  capacity: String,
  voltage: String,
  condition: String,
  transformerId: String,
  customerId: String
}, { timestamps: true });
const Transformer = mongoose.model('Transformer', transformerSchema);

// ✅ Payment Request Schema & Model
const paymentSchema = new mongoose.Schema({
  vendorId: String,
  transformerId: String,
  amount: String,
  remarks: String,
  status: { type: String, default: "Pending" }
});
const PaymentRequest = mongoose.model('PaymentRequest', paymentSchema);

// ✅ Vendor Registration
app.post('/register-vendor', async (req, res) => {
  try {
    const {
      organisationName, gstin, address, email,
      contactPersonName, contactMobile, contactEmail, password
    } = req.body;

    const vendorCode = 'VEND-' + Math.floor(1000 + Math.random() * 9000);
    const customerId = 'CUST-' + Math.floor(1000 + Math.random() * 9000);

    const newVendor = new Vendor({
      organisationName, gstin, address, email,
      contactPersonName, contactMobile, contactEmail,
      password, vendorCode, customerId
    });

    await newVendor.save();

    res.status(201).json({ message: 'Vendor registered successfully!', vendorCode, customerId });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ error: 'Error registering vendor' });
  }
});

// ✅ Vendor Login
app.post('/login-vendor', async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ contactEmail: email });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    if (vendor.password !== password) return res.status(401).json({ error: 'Invalid password' });

    res.status(200).json({
      message: 'Login successful',
      vendorCode: vendor.vendorCode,
      organisationName: vendor.organisationName,
      customerId: vendor.customerId
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ✅ Add Transformer
app.post('/add-transformer', async (req, res) => {
  try {
    const { vendorId, transformerName, capacity, voltage, condition } = req.body;
    const transformerId = 'TRF-' + Math.floor(100000 + Math.random() * 900000);

    // get customerId from vendor
    const vendor = await Vendor.findOne({ vendorCode: vendorId });
    const customerId = vendor ? vendor.customerId : '';

    const newTransformer = new Transformer({
      vendorId,
      transformerName,
      capacity,
      voltage,
      condition,
      transformerId,
      customerId
    });

    await newTransformer.save();
    res.status(201).json({ message: 'Transformer added successfully', transformer: newTransformer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add transformer' });
  }
});

// ✅ Get Transformers for Vendor
app.get('/get-transformers/:vendorId', async (req, res) => {
  try {
    const transformers = await Transformer.find({ vendorId: req.params.vendorId });
    res.status(200).json({ transformers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transformers' });
  }
});

// ✅ Delete Transformer
app.delete('/delete-transformer/:id', async (req, res) => {
  try {
    await Transformer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Transformer deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transformer' });
  }
});
// Get All Payment Requests
app.get('/get-payment-requests', async (req, res) => {
  try {
    const requests = await PaymentRequest.find();
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Approve a Payment Request
app.patch('/approve-request/:id', async (req, res) => {
  try {
    await PaymentRequest.findByIdAndUpdate(req.params.id, { status: 'Approved' });
    res.status(200).json({ message: 'Request approved' });
  } catch (error) {
    res.status(500).json({ error: 'Error approving request' });
  }
});

// ✅ Submit payment request
app.post('/submit-payment', async (req, res) => {
  const { vendorId, transformerId, amount, remarks } = req.body;

  try {
    const newRequest = new PaymentRequest({
      vendorId,
      transformerId,
      amount,
      remarks
    });

    await newRequest.save();
    res.status(201).json({ message: 'Payment request submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error submitting payment request' });
  }
});


// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
