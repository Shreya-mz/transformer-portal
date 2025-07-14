import React, { useState, useEffect } from 'react';

const TransformerForm = () => {
  const [formData, setFormData] = useState({
    make: '',
    capacity: '',
    oilInTons: '',
    serialNumber: '',
    remarks: '',
    oilDrumCount: '',
    oilDrumQuantity: ''
  });

  const [transformers, setTransformers] = useState([]);
  const vendorId = localStorage.getItem('vendorId');
  const customerId = localStorage.getItem('customerId');

  useEffect(() => {
    fetchTransformers();
  }, []);

  const fetchTransformers = async () => {
    try {
      const res = await fetch(`http://localhost:5000/get-transformers/${vendorId}`);
      const data = await res.json();
      if (res.ok) {
        setTransformers(data.transformers);
      } else {
        alert('Failed to fetch transformers');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching transformers');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/add-transformer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, vendorId })
      });

      const data = await res.json();
      if (res.ok) {
        setTransformers([...transformers, data.transformer]);
        setFormData({
          make: '',
          capacity: '',
          oilInTons: '',
          serialNumber: '',
          remarks: '',
          oilDrumCount: '',
          oilDrumQuantity: ''
        });
      } else {
        alert('Failed to add transformer');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding transformer');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/delete-transformer/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        setTransformers(transformers.filter((t) => t._id !== id));
      } else {
        alert(data.message || 'Failed to delete transformer');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting transformer');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Add Transformer</h2>
      <form onSubmit={handleSubmit}>
        <input name="make" placeholder="Make" value={formData.make} onChange={handleChange} required />
        <input name="capacity" placeholder="Capacity (kVA)" value={formData.capacity} onChange={handleChange} required />
        <input name="oilInTons" placeholder="Oil in Tons" value={formData.oilInTons} onChange={handleChange} required />
        <input name="serialNumber" placeholder="Serial Number" value={formData.serialNumber} onChange={handleChange} required />
        <input name="remarks" placeholder="Remarks" value={formData.remarks} onChange={handleChange} />
        <input name="oilDrumCount" placeholder="No. of Oil Drums" value={formData.oilDrumCount} onChange={handleChange} />
        <input name="oilDrumQuantity" placeholder="Drum Quantity (in L)" value={formData.oilDrumQuantity} onChange={handleChange} />
        <button type="submit">Add Transformer</button>
      </form>

      <h3>Transformers List</h3>
      <table border="1" style={{ margin: 'auto', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Make</th>
            <th>Capacity (kVA)</th>
            <th>Oil (T)</th>
            <th>Serial No.</th>
            <th>Remarks</th>
            <th>Oil Drums</th>
            <th>Quantity (L)</th>
            <th>Transformer ID</th>
            <th>Customer ID</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {transformers.map((t) => (
            <tr key={t._id}>
              <td>{t.make}</td>
              <td>{t.capacity}</td>
              <td>{t.oilInTons}</td>
              <td>{t.serialNumber}</td>
              <td>{t.remarks}</td>
              <td>{t.oilDrumCount}</td>
              <td>{t.oilDrumQuantity}</td>
              <td>{t.transformerId}</td>
              <td>{t.customerId}</td>
              <td><button onClick={() => handleDelete(t._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransformerForm;
