import React, { useState, useEffect } from 'react';
import './DashboardVisa.css';

const DashboardVisa = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectionReason, setRejectionReason] = useState({});
  const [updating, setUpdating] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Base URL from environment variable or default to production
  const BASE_API_URL = process.env.REACT_APP_API_BASE_URL || 'https://visaprocessing.travelsansr.com';

  // Normalize URLs to replace localhost with production base URL
  const normalizeUrl = (url) => {
    if (url && typeof url === 'string' && url.startsWith('http://localhost:5000')) {
      return url.replace('http://localhost:5000', BASE_API_URL);
    }
    return url || '/path/to/placeholder-image.jpg'; // Fallback if URL is invalid
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://visaprocessing.travelsansr.com/api/visa/applications');
      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.statusText}`);
      }
      const data = await response.json();
      setApplications(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load applications');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (trackingId, status) => {
    setUpdating({ ...updating, [trackingId]: true });
    setError('');
    setSuccessMessage('');
    try {
      const body = { trackingId, status };
      if (status === 'Rejected') {
        const reason = rejectionReason[trackingId]?.trim();
        if (!reason) {
          throw new Error('Rejection reason is required');
        }
        body.rejectionReason = reason;
      }
      const response = await fetch('https://visaprocessing.travelsansr.com/api/visa/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }
      await fetchApplications();
      setSuccessMessage(`Application ${trackingId} ${status.toLowerCase()} successfully`);
      setRejectionReason({ ...rejectionReason, [trackingId]: '' });
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
    setUpdating({ ...updating, [trackingId]: false });
  };

  const getStatusBadge = (status) => {
    let statusClass = 'status-badge ';
    if (status === 'Approved') statusClass += 'approved';
    else if (status === 'Rejected') statusClass += 'rejected';
    else statusClass += 'pending';
    
    return <span className={statusClass}>{status}</span>;
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button className="retry-button" onClick={fetchApplications}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <h1>Visa Application Dashboard</h1>
      {successMessage && <div className="success">{successMessage}</div>}
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table className="application-table">
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Name</th>
              <th>Passport</th>
              <th>Nationality</th>
              <th>Visa Type</th>
              <th>Travel Date</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Status</th>
              <th>Documents</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.tracking_id}>
                <td data-label="Tracking ID">{app.tracking_id}</td>
                <td data-label="Name">{app.full_name}</td>
                <td data-label="Passport">{app.passport_number}</td>
                <td data-label="Nationality">{app.nationality}</td>
                <td data-label="Visa Type">{app.visa_type}</td>
                <td data-label="Travel Date">{new Date(app.travel_date).toLocaleDateString()}</td>
                <td data-label="Contact">{app.contact_number}</td>
                <td data-label="Email">{app.email}</td>
                <td data-label="Status">{getStatusBadge(app.status)}</td>
                <td data-label="Documents">
                  {app.documents?.length > 0 && Array.isArray(app.documents) ? (
                    app.documents.map((doc, index) => (
                      <a
                        key={index}
                        href={normalizeUrl(doc)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={normalizeUrl(doc)}
                          alt={`Document ${index + 1}`}
                          className="thumbnail"
                          onError={(e) => {
                            e.target.src = '/path/to/placeholder-image.jpg';
                            e.target.alt = 'Image not available';
                          }}
                        />
                      </a>
                    ))
                  ) : (
                    <span>No documents</span>
                  )}
                </td>
                <td data-label="Actions">
                  {app.status !== 'Approved' && app.status !== 'Rejected' ? (
                    <div>
                      <div className="action-row">
                        <button
                          onClick={() => handleStatusUpdate(app.tracking_id, 'Approved')}
                          disabled={updating[app.tracking_id]}
                          className="action-button accept"
                        >
                          {updating[app.tracking_id] ? 'Processing...' : 'Accept'}
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter rejection reason"
                        value={rejectionReason[app.tracking_id] || ''}
                        onChange={(e) =>
                          setRejectionReason({ ...rejectionReason, [app.tracking_id]: e.target.value })
                        }
                        className="reject-input"
                      />
                      <div className="action-row">
                        <button
                          onClick={() => handleStatusUpdate(app.tracking_id, 'Rejected')}
                          disabled={updating[app.tracking_id] || !rejectionReason[app.tracking_id]?.trim()}
                          className="action-button reject"
                        >
                          {updating[app.tracking_id] ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rejection-info">
                      {app.status === 'Rejected' && app.rejection_reason ? (
                        <>
                          <div className="rejection-label">Rejected</div>
                          <div className="rejection-text">{app.rejection_reason}</div>
                        </>
                      ) : (
                        <span>{app.status}</span>
                      )}
                    </div>
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

export default DashboardVisa;