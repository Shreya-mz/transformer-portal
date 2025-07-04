const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://mzshreya007:Shreya07@cluster0.9wyvsy5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

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

const transformerSchema = new mongoose.Schema({
  vendorId: String,
  transformerName: String,
  capacity: String,
  voltage: String,
  condition: String,
  transformerId: String
}, { timestamps: true });

const Transformer = mongoose.model('Transformer', transformerSchema);

// Vendor Registration
app.post('/register-vendor', async (req, res) => {
  try {
    const {
      organisationName,
      gstin,
      address,
      email,
      contactPersonName,
      contactMobile,
      contactEmail,
      password
    } = req.body;

    const vendorCode = 'VEND-' + Math.floor(1000 + Math.random() * 9000);
    const customerId = 'CUST-' + Math.floor(1000 + Math.random() * 9000); // ✅ NEW

    const newVendor = new Vendor({
      organisationName,
      gstin,
      address,
      email,
      contactPersonName,
      contactMobile,
      contactEmail,
      password,
      vendorCode,
      customerId // ✅ ADD THIS
    });

    await newVendor.save();
    res.status(201).json({
      message: 'Vendor registered successfully!',
      vendorCode,
      customerId // ✅ SEND BACK TO FRONTEND
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: 'Error registering vendor' });
  }
});


// Vendor Login
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

// Add Transformer
app.post('/add-transformer', async (req, res) => {
  try {
    const { vendorId, transformerName, capacity, voltage, condition } = req.body;
    const transformerId = 'TR-' + Math.floor(1000 + Math.random() * 9000);

    const newTransformer = new Transformer({
      vendorId,
      transformerName,
      capacity,
      voltage,
      condition,
      transformerId
    });

    await newTransformer.save();
    res.status(201).json({ message: 'Transformer added successfully', transformer: newTransformer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add transformer' });
  }
});

// Get Transformers
app.get('/get-transformers/:vendorId', async (req, res) => {
  try {
    const transformers = await Transformer.find({ vendorId: req.params.vendorId });
    res.status(200).json({ transformers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transformers' });
  }
});

// Delete Transformer
app.delete('/delete-transformer/:id', async (req, res) => {
  try {
    await Transformer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Transformer deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transformer' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
