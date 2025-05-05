import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './FeedbackDashboard.css';

const FeedbackDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch all feedback entries
  const fetchFeedbacks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://backendtravelagencytwomicroservice.onrender.com/api/feedback', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to fetch feedback');
      setFeedbacks(result.data || []);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching feedback.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a feedback entry
  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await fetch(`https://backendtravelagencytwomicroservice.onrender.com/api/feedback/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to delete feedback');
      setSuccessMessage('Feedback deleted successfully.');
      await fetchFeedbacks();
    } catch (err) {
      setError(err.message || 'An error occurred while deleting feedback.');
    } finally {
      setLoading(false);
      setDeleteConfirm(null);
    }
  };

  // Open confirmation dialog
  const confirmDelete = (id) => {
    setDeleteConfirm(id);
    setError('');
    setSuccessMessage('');
  };

  // Cancel deletion
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch feedback on component mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Prepare data for pie chart (rating distribution)
  const ratingData = [
    { name: '1 Star', value: feedbacks.filter(f => f.rating === 1).length },
    { name: '2 Stars', value: feedbacks.filter(f => f.rating === 2).length },
    { name: '3 Stars', value: feedbacks.filter(f => f.rating === 3).length },
    { name: '4 Stars', value: feedbacks.filter(f => f.rating === 4).length },
    { name: '5 Stars', value: feedbacks.filter(f => f.rating === 5).length },
  ].filter(item => item.value > 0); // Remove empty categories

  const COLORS = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db'];

  return (
    <div className="feedback-dashboard">
      <h1>Feedback Dashboard</h1>

      {/* Pie Chart */}
      <div className="chart-container">
        <h2>Rating Distribution</h2>
        {ratingData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ratingData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {ratingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data">No feedback data available for chart.</p>
        )}
      </div>

      {/* Feedback List */}
      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {feedbacks.length === 0 && !loading && !error && (
        <p className="no-feedback">No feedback entries found.</p>
      )}

      {/* Desktop: Table View */}
      <div className="feedback-table-container">
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Destination</th>
              <th>Rating</th>
              <th>Type</th>
              <th>Message</th>
              <th>Subscribe</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback._id} className="feedback-row">
                <td>{feedback.name}</td>
                <td>{feedback.email}</td>
                <td>{feedback.tripDestination}</td>
                <td>{feedback.rating}/5</td>
                <td>{feedback.feedbackType}</td>
                <td className="message-cell">{feedback.message}</td>
                <td>{feedback.subscribe ? 'Yes' : 'No'}</td>
                <td>{new Date(feedback.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => confirmDelete(feedback._id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Card View */}
      <div className="feedback-cards">
        {feedbacks.map((feedback) => (
          <div key={feedback._id} className="feedback-card">
            <div className="card-header">
              <h3>{feedback.name}</h3>
              <button
                className="delete-button"
                onClick={() => confirmDelete(feedback._id)}
                disabled={loading}
              >
                Delete
              </button>
            </div>
            <p><strong>Email:</strong> {feedback.email}</p>
            <p><strong>Destination:</strong> {feedback.tripDestination}</p>
            <p><strong>Rating:</strong> {feedback.rating}/5</p>
            <p><strong>Type:</strong> {feedback.feedbackType}</p>
            <p><strong>Message:</strong> {feedback.message}</p>
            <p><strong>Subscribe:</strong> {feedback.subscribe ? 'Yes' : 'No'}</p>
            <p><strong>Date:</strong> {new Date(feedback.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this feedback entry?</p>
            <div className="modal-buttons">
              <button
                className="confirm-button"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                className="cancel-button"
                onClick={cancelDelete}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackDashboard;