import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingDashboard.css';

const BookingDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [destinationData, setDestinationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    destinationId: '',
    accommodation: '',
    startDate: '',
    endDate: '',
    travelers: '',
    email: ''
  });
  const [destinationId, setDestinationId] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchBookings = async (filterParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/bookings/filter', {
        params: filterParams
      });
      setBookings(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch bookings.');
      console.error('Error fetching bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinationDetails = async () => {
    if (!destinationId) {
      setError('Please enter a Destination ID.');
      setDestinationData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5001/api/destinations/${destinationId}`);
      console.log('API Response for destination ID:', response.data);
      setDestinationData(response.data.destination || null);
      if (!response.data.destination) {
        setError('No destination found for this ID.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch destination details.');
      console.error('Error fetching destination details:', err);
      setDestinationData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'all') {
      fetchBookings();
    }
  }, [activeTab]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const filterParams = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        filterParams[key] = filters[key];
      }
    });
    fetchBookings(filterParams);
  };

  const handleResetFilters = () => {
    setFilters({
      destinationId: '',
      accommodation: '',
      startDate: '',
      endDate: '',
      travelers: '',
      email: ''
    });
    fetchBookings();
  };

  const handleDestinationIdChange = (e) => {
    setDestinationId(e.target.value);
  };

  const handleDestinationIdSubmit = (e) => {
    e.preventDefault();
    fetchDestinationDetails();
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const renderBookingsTable = (data) => (
    <div className="bookings-table">
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Destination ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Travelers</th>
            <th>Accommodation</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Special Requirements</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {(!data || data.length === 0) ? (
            <tr>
              <td colSpan="11">No bookings found</td>
            </tr>
          ) : (
            data.map((booking) => (
              <tr key={booking._id}>
                <td>{booking._id}</td>
                <td>{booking.destinationId}</td>
                <td>{booking.name}</td>
                <td>{booking.email}</td>
                <td>{booking.phone}</td>
                <td>{booking.travelers}</td>
                <td>{booking.accommodation}</td>
                <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                <td>{booking.specialRequirements || 'None'}</td>
                <td>{new Date(booking.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderDestinationDetails = (destination) => (
    <div className="destination-details">
      <h3>Destination Details</h3>
      {destination ? (
        <div className="destination-content">
          <div className="destination-info">
            <div className="info-card">
              <h4>Title</h4>
              <p>{destination.title}</p>
            </div>
            <div className="info-card">
              <h4>Location</h4>
              <p>{destination.location}</p>
            </div>
            <div className="info-card">
              <h4>Description</h4>
              <p>{destination.description}</p>
            </div>
            <div className="info-card">
              <h4>Best Time to Visit</h4>
              <p>{destination.bestTimeToVisit}</p>
            </div>
            <div className="info-card">
              <h4>Things to Do</h4>
              <p>{destination.thingsToDo}</p>
            </div>
          </div>
          <div className="destination-gallery">
            <h4>Images</h4>
            {destination.images && destination.images.length > 0 ? (
              <div className="image-gallery">
                {destination.images.map((image) => (
                  <div key={image._id} className="image-wrapper">
                    <img
                      src={`http://localhost:5001/${image.path}`}
                      alt={image.originalname}
                      className="destination-image"
                      onClick={() => openImageModal(image)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>No images available</p>
            )}
          </div>
        </div>
      ) : (
        <p>No destination details available</p>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={closeImageModal}>&times;</span>
            <img
              src={`http://localhost:5001/${selectedImage.path}`}
              alt={selectedImage.originalname}
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      <h2>Booking Dashboard</h2>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Bookings
        </button>
        <button
          className={`tab-button ${activeTab === 'destination' ? 'active' : ''}`}
          onClick={() => setActiveTab('destination')}
        >
          Find by Destination ID
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'all' && (
        <>
          {/* Filter Form */}
          <div className="filter-section">
            <h3>Filter Bookings</h3>
            <form onSubmit={handleFilterSubmit} className="filter-form">
              <div className="filter-row">
                <div className="filter-group">
                  <label htmlFor="destinationId">Destination ID</label>
                  <input
                    type="text"
                    id="destinationId"
                    name="destinationId"
                    value={filters.destinationId}
                    onChange={handleFilterChange}
                    placeholder="Enter destination ID"
                  />
                </div>
                <div className="filter-group">
                  <label htmlFor="accommodation">Accommodation</label>
                  <select
                    id="accommodation"
                    name="accommodation"
                    value={filters.accommodation}
                    onChange={handleFilterChange}
                  >
                    <option value="">All</option>
                    <option value="hotel">Hotel</option>
                    <option value="hostel">Hostel</option>
                    <option value="apartment">Apartment</option>
                    <option value="resort">Resort</option>
                  </select>
                </div>
              </div>
              <div className="filter-row">
                <div className="filter-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="filter-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
              <div className="filter-row">
                <div className="filter-group">
                  <label htmlFor="travelers">Travelers</label>
                  <input
                    type="number"
                    id="travelers"
                    name="travelers"
                    min="1"
                    value={filters.travelers}
                    onChange={handleFilterChange}
                    placeholder="Number of travelers"
                  />
                </div>
                <div className="filter-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={filters.email}
                    onChange={handleFilterChange}
                    placeholder="Enter email"
                  />
                </div>
              </div>
              <div className="filter-actions">
                <button type="submit" className="filter-button">Apply Filters</button>
                <button type="button" className="reset-button" onClick={handleResetFilters}>
                  Reset Filters
                </button>
              </div>
            </form>
          </div>

          {/* All Bookings Table */}
          {error && <div className="error-message">{error}</div>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            renderBookingsTable(bookings)
          )}
        </>
      )}

      {activeTab === 'destination' && (
        <>
          {/* Destination ID Search Form */}
          <div className="filter-section">
            <h3>Find Destination Details</h3>
            <form onSubmit={handleDestinationIdSubmit} className="filter-form">
              <div className="filter-row">
                <div className="filter-group">
                  <label htmlFor="destinationSearch">Destination ID</label>
                  <input
                    type="text"
                    id="destinationSearch"
                    value={destinationId}
                    onChange={handleDestinationIdChange}
                    placeholder="Enter destination ID"
                    required
                  />
                </div>
              </div>
              <div className="filter-actions">
                <button type="submit" className="filter-button">Search</button>
              </div>
            </form>
          </div>

          {/* Destination Details */}
          {error && <div className="error-message">{error}</div>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            renderDestinationDetails(destinationData)
          )}
        </>
      )}
    </div>
  );
};

export default BookingDashboard;