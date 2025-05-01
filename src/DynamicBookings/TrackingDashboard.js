import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios'; // Ensure axios is imported
import { getUserTrackingData, getTourTrackingData, getUserTourInteractions } from '../toursComponent/trackWhatsAppRequest';
import "./TrackingDashboard.css";

const TrackingDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [userTracking, setUserTracking] = useState(null);
  const [tourTracking, setTourTracking] = useState(null);
  const [combinedTracking, setCombinedTracking] = useState(null);
  const [allToursUsers, setAllToursUsers] = useState(null); // New state for all tours and users
  const [error, setError] = useState(null);
  
  // Filter states
  const [userId, setUserId] = useState('');
  const [tourId, setTourId] = useState('');
  const [activeTab, setActiveTab] = useState('user'); // 'user', 'tour', 'combined', 'all'


  // New function to fetch all tours and users with tour details
  const fetchAllToursAndUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all tours and users from the new endpoint
      const response = await axios.get('https://backendtravelagency.onrender.com/api/all-tours-and-users-details');
      
      if (response.data.success) {
        const { tours, users } = response.data.data;

        // Fetch tour details for each tourId
        const tourDetailsPromises = tours.map(async (tour) => {
          try {
            const tourResponse = await axios.get(
              `https://backendtravelagencytwomicroservice.onrender.com/api/tours/${tour.tourId}`,
              { timeout: 5000 } // Add timeout to prevent hanging
            );
            return {
              ...tour,
              details: tourResponse.data.success ? tourResponse.data.data : null,
            };
          } catch (err) {
            console.error(`Error fetching details for tour ${tour.tourId}:`, err);
            return { ...tour, details: null }; // Return tour without details on error
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
  };

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
  }, [userId]); // userId is a dependency of fetchUserData

  
  // Load current user's tracking data by default
  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    if (currentUserId) {
      setUserId(currentUserId);
      fetchUserData(currentUserId);
    }
  }, [fetchUserData]); // Add fetchUserData to the dependency array

  const fetchTourData = async (id = tourId) => {
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
  };

  const fetchCombinedData = async () => {
    if (!userId || !tourId) {
      setError('Both user ID and tour ID are required for combined view');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUserTourInteractions(userId, tourId);
      
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeTab === 'user') {
      fetchUserData();
    } else if (activeTab === 'tour') {
      fetchTourData();
    } else if (activeTab === 'combined') {
      fetchCombinedData();
    } else if (activeTab === 'all') {
      fetchAllToursAndUsers(); // Trigger fetch for new tab
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="tracking-dashboard">
      <h1>User Interaction Tracking Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="tracking-tabs">
        <button 
          className={activeTab === 'user' ? 'active' : ''} 
          onClick={() => setActiveTab('user')}
        >
          User Tracking
        </button>
        <button 
          className={activeTab === 'tour' ? 'active' : ''} 
          onClick={() => setActiveTab('tour')}
        >
          Tour Tracking
        </button>
        <button 
          className={activeTab === 'combined' ? 'active' : ''} 
          onClick={() => setActiveTab('combined')}
        >
          Combined Filter
        </button>
        <button 
          className={activeTab === 'all' ? 'active' : ''} 
          onClick={() => {
            setActiveTab('all');
            fetchAllToursAndUsers(); // Auto-fetch when tab is clicked
          }}
        >
          All Tours & Users
        </button>
      </div>
      
      {/* Filter Form */}
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
        
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Filter'}
        </button>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Results Display */}
      <div className="tracking-results">
        {activeTab === 'user' && userTracking && (
          <div className="user-tracking">
            <h2>User Tracking Data</h2>
            <div className="summary-card">
              <h3>Summary</h3>
              <p>Total Interactions: {userTracking.summary.totalInteractions}</p>
              <p>Tours Interacted With: {userTracking.summary.tourInteractions.length}</p>
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
                    <td>{tour._id}</td>
                    <td>{tour.count}</td>
                    <td>{formatDate(tour.firstInteraction)}</td>
                    <td>{formatDate(tour.lastInteraction)}</td>
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
                    <td>{formatDate(interaction.timestamp)}</td>
                    <td>{interaction.tourId}</td>
                    <td>{interaction.source}</td>
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
                    <td>{user._id}</td>
                    <td>{user.count}</td>
                    <td>{formatDate(user.firstInteraction)}</td>
                    <td>{formatDate(user.lastInteraction)}</td>
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
                    <td>{day._id}</td>
                    <td>{day.count}</td>
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
                    <td>{formatDate(interaction.timestamp)}</td>
                    <td>{interaction.source}</td>
                    <td className="user-agent">{interaction.userAgent}</td>
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
                    <td>{tour.tourId}</td>
                    <td>{tour.details?.name || 'N/A'}</td>
                    <td>{tour.details?.description || 'No details available'}</td>
                    <td>{tour.addedOn}</td>
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
                    <td>{user.userId}</td>
                    <td>{user.addedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingDashboard;