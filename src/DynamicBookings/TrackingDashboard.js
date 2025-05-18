import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import TabNavigation from './TabNavigation';
import { getUserTrackingData, getTourTrackingData, getUserTourInteractions } from '../toursComponent/trackWhatsAppRequest';
import './TrackingDashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const TrackingDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [userTracking, setUserTracking] = useState(null);
  const [tourTracking, setTourTracking] = useState(null);
  const [combinedTracking, setCombinedTracking] = useState(null);
  const [allToursUsers, setAllToursUsers] = useState(null);
  const [tourDetails, setTourDetails] = useState(null); // New state for tour details
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [tourId, setTourId] = useState('');
  const [findTourId, setFindTourId] = useState('');
  const [activeTab, setActiveTab] = useState('user');

  const fetchAllToursAndUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://backendtravelagency.onrender.com/api/all-tours-and-users-details');
      if (response.data.success) {
        const { tours, users } = response.data.data;
        const tourDetailsPromises = tours.map(async (tour) => {
          try {
            const tourResponse = await axios.get(
              `https://backendtravelagencytwomicroservice.onrender.com/api/tours/${tour.tourId}`,
              { timeout: 5000 }
            );
            return {
              ...tour,
              details: tourResponse.data.success ? tourResponse.data.data : null,
            };
          } catch (err) {
            console.error(`Error fetching details for tour ${tour.tourId}:`, err);
            return { ...tour, details: null };
          }
        });
        const toursWithDetails = await Promise.all(tourDetailsPromises);
        setAllToursUsers({
          tours: toursWithDetails,
          users,
          totalTours: response.data.data.totalTours,
          totalUsers: response.data.data.totalUsers,
        });
      } else {
        setError(response.data.message || 'Failed to fetch tours and users');
      }
    } catch (err) {
      setError('Error loading tours and users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserData = useCallback(async (id = userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserTrackingData(id);
      if (response.success) {
        setUserTracking(response.data);
      } else {
        setError(response.error || 'Failed to fetch user tracking data');
      }
    } catch (err) {
      setError('Error loading tracking data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchTourData = useCallback(async (id = tourId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTourTrackingData(id);
      if (response.success) {
        setTourTracking(response.data);
      } else {
        setError(response.error || 'Failed to fetch tour tracking data');
      }
    } catch (err) {
      setError('Error loading tracking data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tourId]);

  const fetchTourDetails = useCallback(async (id = findTourId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://backendtravelagencytwomicroservice.onrender.com/api/tours/${id}`,
        { timeout: 5000 }
      );
      if (response.data.success) {
        setTourDetails(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch tour details');
      }
    } catch (err) {
      setError('Error loading tour details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [findTourId]);

  const fetchCombinedData = useCallback(async () => {
    if (!userId || !(tourId || findTourId)) {
      setError('Both user ID and tour ID are required for combined view');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getUserTourInteractions(userId, tourId || findTourId);
      if (response.success) {
        setCombinedTracking(response.data);
      } else {
        setError(response.error || 'Failed to fetch combined tracking data');
      }
    } catch (err) {
      setError('Error loading tracking data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId, tourId, findTourId]);

  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    if (currentUserId) {
      setUserId(currentUserId);
      fetchUserData(currentUserId);
    }
  }, [fetchUserData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'user') {
      fetchUserData();
    } else if (activeTab === 'tour') {
      fetchTourData();
    } else if (activeTab === 'combined') {
      fetchCombinedData();
    } else if (activeTab === 'all') {
      fetchAllToursAndUsers();
    } else if (activeTab === 'findTour') {
      fetchTourDetails();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="tracking-dashboard">
      <button
        className="theme-toggle"
        onClick={() => document.documentElement.setAttribute('data-theme', document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        🌗
      </button>
      <h1>User Interaction Tracking Dashboard</h1>
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fetchAllToursAndUsers={fetchAllToursAndUsers}
        fetchTourData={fetchTourData}
      />
      <form onSubmit={handleSubmit} className="filter-form">
        {(activeTab === 'user' || activeTab === 'combined') && (
          <div className="form-group">
            <label htmlFor="userId">User ID:</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
              required={activeTab === 'user' || activeTab === 'combined'}
            />
          </div>
        )}
        {(activeTab === 'tour' || activeTab === 'combined') && (
          <div className="form-group">
            <label htmlFor="tourId">Tour ID:</label>
            <input
              type="text"
              id="tourId"
              value={tourId}
              onChange={(e) => setTourId(e.target.value)}
              placeholder="Enter tour ID"
              required={activeTab === 'tour' || activeTab === 'combined'}
            />
          </div>
        )}
        {activeTab === 'findTour' && (
          <div className="form-group">
            <label htmlFor="findTourId">Find by Tour ID:</label>
            <input
              type="text"
              id="findTourId"
              value={findTourId}
              onChange={(e) => setFindTourId(e.target.value)}
              placeholder="Enter tour ID"
              required
            />
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Filter'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <div className="tracking-results">
        {activeTab === 'user' && userTracking && (
          <div className="user-tracking">
            <h2>User Tracking Data</h2>
            <div className="summary-card">
              <h3>Summary</h3>
              <p>Total Interactions: {userTracking.summary.totalInteractions}</p>
              <p>Tours Interacted With: {userTracking.summary.tourInteractions.length}</p>
            </div>
            <div className="pie-chart">
              <Pie data={{
                labels: userTracking.summary.tourInteractions.map(tour => tour._id),
                datasets: [{
                  label: 'Interactions per Tour',
                  data: userTracking.summary.tourInteractions.map(tour => tour.count),
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                }],
              }} />
            </div>
            <h3>Tour Interactions</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tour ID</th>
                  <th>Interactions</th>
                  <th>First Interaction</th>
                  <th>Last Interaction</th>
                </tr>
              </thead>
              <tbody>
                {userTracking.summary.tourInteractions.map(tour => (
                  <tr key={tour._id}>
                    <td data-label="Tour ID">{tour._id}</td>
                    <td data-label="Interactions">{tour.count}</td>
                    <td data-label="First Interaction">{formatDate(tour.firstInteraction)}</td>
                    <td data-label="Last Interaction">{formatDate(tour.lastInteraction)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Recent Interactions</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Tour ID</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {userTracking.interactions.map((interaction, index) => (
                  <tr key={index}>
                    <td data-label="Date">{formatDate(interaction.timestamp)}</td>
                    <td data-label="Tour ID">{interaction.tourId}</td>
                    <td data-label="Source">{interaction.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'tour' && tourTracking && (
          <div className="tour-tracking">
            <h2>Tour Tracking Data</h2>
            <div className="summary-card">
              <h3>Summary</h3>
              <p>Total Interactions: {tourTracking.summary.totalInteractions}</p>
              <p>Unique Users: {tourTracking.summary.uniqueUsers}</p>
            </div>
            <div className="pie-chart">
              <Pie data={{
                labels: tourTracking.summary.userInteractions.map(user => user._id),
                datasets: [{
                  label: 'Interactions per User',
                  data: tourTracking.summary.userInteractions.map(user => user.count),
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                }],
              }} />
            </div>
            <h3>User Interactions</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Interactions</th>
                  <th>First Interaction</th>
                  <th>Last Interaction</th>
                </tr>
              </thead>
              <tbody>
                {tourTracking.summary.userInteractions.map(user => (
                  <tr key={user._id}>
                    <td data-label="User ID">{user._id}</td>
                    <td data-label="Interactions">{user.count}</td>
                    <td data-label="First Interaction">{formatDate(user.firstInteraction)}</td>
                    <td data-label="Last Interaction">{formatDate(user.lastInteraction)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Daily Interactions</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Interactions</th>
                </tr>
              </thead>
              <tbody>
                {tourTracking.summary.dailyInteractions.map(day => (
                  <tr key={day._id}>
                    <td data-label="Date">{day._id}</td>
                    <td data-label="Interactions">{day.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'combined' && combinedTracking && (
          <div className="combined-tracking">
            <h2>User-Tour Interaction Data</h2>
            <div className="summary-card">
              <h3>Summary</h3>
              <p>Total Interactions: {combinedTracking.stats.totalCount}</p>
              <p>First Interaction: {formatDate(combinedTracking.stats.firstInteraction)}</p>
              <p>Last Interaction: {formatDate(combinedTracking.stats.lastInteraction)}</p>
            </div>
            <div className="pie-chart">
              <Pie data={{
                labels: Object.keys(combinedTracking.stats.sources),
                datasets: [{
                  label: 'Interactions by Source',
                  data: Object.values(combinedTracking.stats.sources),
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                }],
              }} />
            </div>
            <h3>Interaction Sources</h3>
            <ul className="source-list">
              {Object.entries(combinedTracking.stats.sources).map(([source, count]) => (
                <li key={source}>
                  <strong>{source}:</strong> {count} interactions
                </li>
              ))}
            </ul>
            <h3>Interaction History</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Source</th>
                  <th>User Agent</th>
                </tr>
              </thead>
              <tbody>
                {combinedTracking.interactions.map((interaction, index) => (
                  <tr key={index}>
                    <td data-label="Date">{formatDate(interaction.timestamp)}</td>
                    <td data-label="Source">{interaction.source}</td>
                    <td data-label="User Agent" className="user-agent">{interaction.userAgent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'all' && allToursUsers && (
          <div className="all-tours-users">
            <h2>All Tours and Users (Newest First)</h2>
            <div className="summary-card">
              <h3>Summary</h3>
              <p>Total Tours: {allToursUsers.totalTours}</p>
              <p>Total Users: {allToursUsers.totalUsers}</p>
            </div>
            <div className="pie-chart">
              <Pie data={{
                labels: ['Total Tours', 'Total Users'],
                datasets: [{
                  label: 'Tours vs Users',
                  data: [allToursUsers.totalTours, allToursUsers.totalUsers],
                  backgroundColor: ['#FF6384', '#36A2EB'],
                }],
              }} />
            </div>
            <h3>Tours</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tour ID</th>
                  <th>Tour Name</th>
                  <th>Description</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {allToursUsers.tours.map((tour, index) => (
                  <tr key={index}>
                    <td data-label="Tour ID">{tour.tourId}</td>
                    <td data-label="Tour Name">{tour.details?.name || 'N/A'}</td>
                    <td data-label="Description">{tour.details?.description || 'No details available'}</td>
                    <td data-label="Last Active">{tour.addedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Users</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {allToursUsers.users.map((user, index) => (
                  <tr key={index}>
                    <td data-label="User ID">{user.userId}</td>
                    <td data-label="Last Active">{user.addedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'findTour' && tourDetails && (
          <div className="tour-details">
            <h2>Tour Details</h2>
            <div className="tour-details-card">
              <h3>{tourDetails.name || 'N/A'}</h3>
              <div className="tour-images">
                {tourDetails.images && tourDetails.images.length > 0 ? (
                  tourDetails.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt='Tour'
                      className="tour-image"
                    />
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>
              <p><strong>Description:</strong> {tourDetails.description || 'N/A'}</p>
              <p><strong>Price:</strong> {tourDetails.price ? `$${tourDetails.price}` : 'N/A'}</p>
              <p><strong>Duration:</strong> {tourDetails.duration || 'N/A'}</p>
              <p><strong>Location:</strong> {tourDetails.location || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingDashboard;