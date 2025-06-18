const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Atlas Connection
mongoose.connect('mongodb+srv://mzshreya007:Shreya07@cluster0.9wyvsy5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: "Hello from backend!" });
});

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
  vendorCode: String
}, { timestamps: true });

const Vendor = mongoose.model('Vendor', vendorSchema);

// ✅ Transformer Schema & Model
const transformerSchema = new mongoose.Schema({
  vendorId: String,
  transformerName: String,
  capacity: String,
  voltage: String,
  condition: String
}, { timestamps: true });

const Transformer = mongoose.model('Transformer', transformerSchema);

// ✅ Register Vendor
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

    const newVendor = new Vendor({
      organisationName,
      gstin,
      address,
      email,
      contactPersonName,
      contactMobile,
      contactEmail,
      password,
      vendorCode
    });

    await newVendor.save();
    res.status(201).json({ message: 'Vendor registered successfully!', vendorCode });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: 'Error registering vendor' });
  }
});

// ✅ Login Vendor
app.post('/login-vendor', async (req, res) => {
  const { email, password } = req.body;

  try {
    const vendor = await Vendor.findOne({ contactEmail: email });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    if (vendor.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.status(200).json({
      message: 'Login successful',
      vendorCode: vendor.vendorCode,
      organisationName: vendor.organisationName
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Error logging in vendor' });
  }
});

// ✅ Add Transformer
app.post('/add-transformer', async (req, res) => {
  const { vendorId, transformerName, capacity, voltage, condition } = req.body;

  try {
    const transformer = new Transformer({
      vendorId,
      transformerName,
      capacity,
      voltage,
      condition
    });

    await transformer.save();
    res.status(201).json({ message: 'Transformer added successfully', transformer });
  } catch (error) {
    console.error("Transformer save error:", error);
    res.status(500).json({ message: 'Error adding transformer' });
  }
});

// ✅ Get Transformers for a Vendor
app.get('/get-transformers/:vendorId', async (req, res) => {
  const { vendorId } = req.params;

  try {
    const transformers = await Transformer.find({ vendorId });
    res.status(200).json({ transformers });
  } catch (error) {
    console.error("Fetch transformers error:", error);
    res.status(500).json({ message: "Error fetching transformers" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
