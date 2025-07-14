// frontend-app/src/components/ApprovalRequestForm.js
import React, { useEffect, useState } from 'react';

const ApprovalRequestForm = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:5000/get-payment-requests');
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests);
      } else {
        alert('Failed to fetch payment requests');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching payment requests');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/approve-request/${id}`, {
        method: 'PATCH'
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Request approved');
        fetchRequests(); // refresh list
      } else {
        alert(data.error || 'Failed to approve request');
      }
    } catch (err) {
      console.error(err);
      alert('Error approving request');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Approval Requests</h2>
      {requests.length === 0 ? (
        <p>No payment requests found.</p>
      ) : (
        <table style={{ margin: 'auto', borderCollapse: 'collapse' }} border="1">
          <thead>
            <tr>
              <th>Vendor ID</th>
              <th>Transformer ID</th>
              <th>Amount</th>
              <th>Remarks</th>
              <th>Status</th>
              <th>Approve</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.vendorId}</td>
                <td>{req.transformerId}</td>
                <td>{req.amount}</td>
                <td>{req.remarks}</td>
                <td>{req.status}</td>
                <td>
                  {req.status !== 'Approved' ? (
                    <button onClick={() => approveRequest(req._id)}>Approve</button>
                  ) : (
                    '✅'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApprovalRequestForm;
