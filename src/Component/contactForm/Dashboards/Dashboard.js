import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingRequest, setEditingRequest] = useState(null);

  const destinations = useMemo(() => [
    'Europe', 'Asia', 'North America', 'South America', 'Africa',
    'Australia', 'Antarctica', 'Caribbean', 'Middle East', 'Pacific Islands',
  ], []);

  const travelTypes = useMemo(() => [
    'Beach Vacation', 'Adventure Trip', 'Cultural Experience', 'City Break',
    'Luxury Retreat', 'Family Holiday', 'Honeymoon', 'Group Tour',
    'Business Trip', 'Custom Itinerary',
  ], []);

  const budgetRanges = useMemo(() => [
    'Economy ($1,000 - $3,000)', 'Standard ($3,000 - $5,000)',
    'Premium ($5,000 - $10,000)', 'Luxury ($10,000+)',
  ], []);

  const referralSources = useMemo(() => [
    'Search Engine', 'Social Media', 'Friend or Family', 'Travel Magazine',
    'Travel Blog', 'TV Advertisement', 'Email Newsletter', 'Travel Expo', 'Other',
  ], []);

  const generateMockData = useCallback(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Test User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `555-000-${1000 + i}`,
      destination: destinations[i % destinations.length],
      travelType: travelTypes[i % travelTypes.length],
      budget: budgetRanges[i % budgetRanges.length],
      travelers: Math.floor(Math.random() * 5) + 1,
      departureDate: '2025-06-15',
      returnDate: '2025-06-25',
      message: 'Some travel preferences',
      hearAbout: referralSources[i % referralSources.length],
      subscribe: i % 2 === 0,
      termsAccepted: true,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    }));
  }, [destinations, travelTypes, budgetRanges, referralSources]);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://backendtravelagencytwomicroservice.onrender.com/api/travel/requests');
      
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response: Expected an array of requests');
      }
      
      setRequests(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(`Error fetching requests: ${err.message}`);
      
      if (err.code === 'ERR_NETWORK') {
        const mockData = generateMockData();
        setRequests(mockData);
        setError('Using mock data: API server unreachable');
      }
    } finally {
      setLoading(false);
    }
  }, [generateMockData]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = useMemo(() => {
    let filtered = [...requests];
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (req) =>
          (req.destination?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (req.travelType?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (req.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }
    if (filterType) {
      filtered = filtered.filter((req) => req.travelType === filterType);
    }
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [requests, searchTerm, filterType]);

  const isNewRequest = (createdAt) => {
    const requestDate = new Date(createdAt);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return requestDate > sevenDaysAgo;
  };

  const handleEdit = (request) => {
    setEditingRequest({ ...request });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Sorry you cannot delete contact form this can use for tracking user?')) return;
    
    try {
      setActionLoading(true);
      await axios.delete(`https://backendtravelagencytwomicroservice.onrender.com/api/travel/requests/${id}`);
      
      setRequests(requests.filter((req) => req.id !== id));
      setError('');
    } catch (err) {
      console.error('Error deleting request:', err);
      setError(`Error deleting request: ${err.message}`);
      
      if (err.code === 'ERR_NETWORK') {
        setRequests(requests.filter((req) => req.id !== id));
        setError('Warning: Deletion may not be saved to server');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingRequest) return;
    
    if (!editingRequest.name || !editingRequest.email || !editingRequest.destination || 
        !editingRequest.travelType || !editingRequest.budget || 
        !editingRequest.departureDate || !editingRequest.returnDate || 
        !editingRequest.termsAccepted) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setActionLoading(true);
      const response = await axios.put(
        `https://backendtravelagencytwomicroservice.onrender.com/api/travel/requests/${editingRequest.id}`,
        editingRequest
      );
      
      if (!response.data.id) {
        throw new Error('Invalid response: Missing request ID');
      }
      
      setRequests(
        requests.map((req) => (req.id === response.data.id ? response.data : req))
      );
      setEditingRequest(null);
      setError('');
    } catch (err) {
      console.error('Error updating request:', err);
      setError(`Error updating request: ${err.message}`);
      
      if (err.code === 'ERR_NETWORK') {
        setRequests(
          requests.map((req) => (req.id === editingRequest.id ? editingRequest : req))
        );
        setEditingRequest(null);
        setError('Warning: Update may not be saved to server');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingRequest((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (loading) return (
    <div className='loading-container'>
      <div className='loading-spinner'></div>
      <p className='loading-text'>Loading travel request data...</p>
    </div>
  );

  return (
    <div className='dashboard-container'>
      <header className='dashboard-header'>
        <h1 className='header-title'>Travel Requests Dashboard</h1>
        {error && <div className={error.includes('Warning') ? 'alert-warning' : 'alert-error'}>{error}</div>}
      </header>

      {actionLoading && (
        <div className='processing-overlay'>
          <div className='processing-spinner'></div>
          <span className='processing-text'>Processing...</span>
        </div>
      )}

      <section className='summary-section'>
        <div className='summary-card'>
          <h3 className='summary-title'>Total Requests</h3>
          <p className='summary-number'>{requests.length}</p>
        </div>
        <div className='summary-card'>
          <h3 className='summary-title'>Most Popular Destination</h3>
          <p className='summary-text'>
            {requests.length > 0
              ? destinations.reduce((prev, curr) => {
                  const prevCount = requests.filter(req => req.destination === prev).length;
                  const currCount = requests.filter(req => req.destination === curr).length;
                  return prevCount >= currCount ? prev : curr;
                }, destinations[0])
              : 'N/A'}
          </p>
        </div>
        <div className='summary-card'>
          <h3 className='summary-title'>Most Requested Travel Type</h3>
          <p className='summary-text'>
            {requests.length > 0
              ? travelTypes.reduce((prev, curr) => {
                  const prevCount = requests.filter(req => req.travelType === prev).length;
                  const currCount = requests.filter(req => req.travelType === curr).length;
                  return prevCount >= currCount ? prev : curr;
                }, travelTypes[0])
              : 'N/A'}
          </p>
        </div>
      </section>

      <section className='controls-section'>
        <div className='search-container'>
          <input
            type='text'
            placeholder='Search by name, destination or travel type'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='search-input'
          />
          <svg className='search-icon' viewBox='0 0 24 24'>
            <path d='M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/>
          </svg>
        </div>
        <div className='filter-container'>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className='filter-select'
          >
            <option value=''>All Travel Types</option>
            {travelTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className='table-section'>
        {filteredRequests.length > 0 ? (
          <div className='table-wrapper'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th className='table-header'>Name</th>
                  <th className='table-header'>Email</th>
                  <th className='table-header'>Destination</th>
                  <th className='table-header'>Travel Type</th>
                  <th className='table-header'>Budget</th>
                  <th className='table-header'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} className='table-row'>
                    <td data-label='Name' className='table-cell'>
                      {request.name || 'N/A'}
                      {isNewRequest(request.createdAt) && (
                        <span className='new-badge'>
                          <svg
                            className='new-icon'
                            viewBox='0 0 24 24'
                            width='14'
                            height='14'
                            fill='currentColor'
                          >
                            <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/>
                          </svg>
                          New
                        </span>
                      )}
                    </td>
                    <td data-label='Email' className='table-cell'>{request.email || 'N/A'}</td>
                    <td data-label='Destination' className='table-cell'>{request.destination || 'N/A'}</td>
                    <td data-label='Travel Type' className='table-cell'>{request.travelType || 'N/A'}</td>
                    <td data-label='Budget' className='table-cell'>{request.budget || 'N/A'}</td>
                    <td data-label='Actions' className='actions-cell'>
                      <button 
                        className='action-button edit-button'
                        onClick={() => handleEdit(request)}
                        disabled={actionLoading}
                      >
                        <svg className='action-icon' viewBox='0 0 24 24' width='16' height='16'>
                          <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/>
                        </svg>
                        Edit
                      </button>
                      <button 
                        className='action-button delete-button'
                        onClick={() => handleDelete(request.id)}
                        disabled={actionLoading}
                      >
                        <svg className='action-icon' viewBox='0 0 24 24' width='16' height='16'>
                          <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'/>
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='empty-state'>
            <svg className='empty-state-icon' viewBox='0 0 24 24'>
              <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/>
            </svg>
            <h3 className='empty-state-title'>No travel requests found</h3>
            <p className='empty-state-text'>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </section>

      {editingRequest && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2 className='modal-title'>Edit Travel Request</h2>
              <button 
                className='modal-close-button'
                onClick={() => setEditingRequest(null)}
                disabled={actionLoading}
              >
                ×
              </button>
            </div>
            
            <div className='modal-body'>
              <div className='form-grid'>
                <div className='form-group'>
                  <label htmlFor='name' className='form-label'>Full Name</label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={editingRequest.name || ''}
                    onChange={handleChange}
                    required
                    className='form-input'
                  />
                </div>
                
                <div className='form-group'>
                  <label htmlFor='email' className='form-label'>Email Address</label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={editingRequest.email || ''}
                    onChange={handleChange}
                    required
                    className='form-input'
                  />
                </div>
                
                <div className='form-group'>
                  <label htmlFor='phone' className='form-label'>Phone Number</label>
                  <input
                    type='tel'
                    id='phone'
                    name='phone'
                    value={editingRequest.phone || ''}
                    onChange={handleChange}
                    className='form-input'
                  />
                </div>
                
                <div className='form-group'>
                  <label htmlFor='destination' className='form-label'>Destination</label>
                  <select
                    id='destination'
                    name='destination'
                    value={editingRequest.destination || ''}
                    onChange={handleChange}
                    required
                    className='form-select'
                  >
                    <option value=''>Select a destination</option>
                    {destinations.map((destination, index) => (
                      <option key={index} value={destination}>
                        {destination}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className='form-group'>
                  <label htmlFor='travelType' className='form-label'>Travel Type</label>
                  <select
                    id='travelType'
                    name='travelType'
                    value={editingRequest.travelType || ''}
                    onChange={handleChange}
                    required
                    className='form-select'
                  >
                    <option value=''>Select travel type</option>
                    {travelTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className='form-group'>
                  <label htmlFor='budget' className='form-label'>Budget Range</label>
                  <select
                    id='budget'
                    name='budget'
                    value={editingRequest.budget || ''}
                    onChange={handleChange}
                    required
                    className='form-select'
                  >
                    <option value=''>Select budget</option>
                    {budgetRanges.map((range, index) => (
                      <option key={index} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className='form-group'>
                  <label htmlFor='travelers' className='form-label'>Number of Travelers</label>
                  <input
                    type='number'
                    id='travelers'
                    name='travelers'
                    min='1'
                    value={editingRequest.travelers || '1'}
                    onChange={handleChange}
                    required
                    className='form-input'
                  />
                </div>
                
                <div className='form-group'>
                  <label htmlFor='departureDate' className='form-label'>Departure Date</label>
                  <input
                    type='date'
                    id='departureDate'
                    name='departureDate'
                    value={editingRequest.departureDate || ''}
                    onChange={handleChange}
                    required
                    className='form-input'
                  />
                </div>
                
                <div className='form-group'>
                  <label htmlFor='returnDate' className='form-label'>Return Date</label>
                  <input
                    type='date'
                    id='returnDate'
                    name='returnDate'
                    value={editingRequest.returnDate || ''}
                    onChange={handleChange}
                    required
                    className='form-input'
                  />
                </div>
                
                <div className='form-group form-group-full'>
                  <label htmlFor='message' className='form-label'>Travel Preferences</label>
                  <textarea
                    id='message'
                    name='message'
                    value={editingRequest.message || ''}
                    onChange={handleChange}
                    rows='3'
                    className='form-textarea'
                  />
                </div>
                
                <div className='form-group'>
                  <label htmlFor='hearAbout' className='form-label'>How did you hear about us?</label>
                  <select
                    id='hearAbout'
                    name='hearAbout'
                    value={editingRequest.hearAbout || ''}
                    onChange={handleChange}
                    className='form-select'
                  >
                    <option value=''>Please select</option>
                    {referralSources.map((source, index) => (
                      <option key={index} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className='form-group form-group-checkbox'>
                  <input
                    type='checkbox'
                    id='subscribe'
                    name='subscribe'
                    checked={editingRequest.subscribe || false}
                    onChange={handleChange}
                    className='form-checkbox'
                  />
                  <label htmlFor='subscribe' className='form-label-checkbox'>Subscribe to newsletter</label>
                </div>
                
                <div className='form-group form-group-checkbox'>
                  <input
                    type='checkbox'
                    id='termsAccepted'
                    name='termsAccepted'
                    checked={editingRequest.termsAccepted || false}
                    onChange={handleChange}
                    required
                    className='form-checkbox'
                  />
                  <label htmlFor='termsAccepted' className='form-label-checkbox'>Terms Accepted</label>
                </div>
              </div>
            </div>
            
            <div className='modal-footer'>
              <button 
                className='modal-button modal-button-primary'
                onClick={handleUpdate}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <svg className='modal-spinner' viewBox='0 0 50 50'>
                      <circle cx='25' cy='25' r='20' fill='none' strokeWidth='5'></circle>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
              <button 
                className='modal-button modal-button-secondary'
                onClick={() => setEditingRequest(null)}
                disabled={actionLoading}
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

export default Dashboard;