import React, { useState, useEffect } from 'react';
import DestinationList from './DestinationList';
import DestinationUpload from '../DashboardComponent/DestinatonUpload'; // Ensure this is the correct path
import './Apps.css';

function MainUploadingDestination() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch all destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const response = await fetch('http://localhost:5000/api/destinations');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.success && Array.isArray(data.destinations)) {
          setDestinations(data.destinations);
        } else {
          setError(data.message || 'Failed to fetch destinations');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [refreshTrigger]);

  // Handle successful creation
  const handleCreateSuccess = (newDestination) => {
    setShowForm(false);
    setDestinations((prev) => [...prev, newDestination]); // Optimistically update
    setRefreshTrigger((prev) => prev + 1); // Trigger refresh for consistency
  };

  // Handle successful update
  const handleUpdateSuccess = (updatedDestination) => {
    setEditingDestination(null);
    setShowForm(false);
    setDestinations((prev) =>
      prev.map((dest) =>
        dest._id === updatedDestination._id ? updatedDestination : dest
      )
    ); // Optimistically update
    setRefreshTrigger((prev) => prev + 1); // Trigger refresh
  };

  // Handle edit button click
  const handleEdit = (destination) => {
    setEditingDestination(destination);
    setShowForm(true);
    setError(null); // Clear errors when opening form
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this destination? All associated files will be permanently removed.'
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/destinations/${id}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setDestinations((prev) => prev.filter((dest) => dest._id !== id));
          setRefreshTrigger((prev) => prev + 1); // Trigger refresh
          alert('Destination deleted successfully');
        } else {
          setError(data.message || 'Failed to delete destination');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error(err);
      }
    }
  };

  // Handle form cancellation
  const cancelForm = () => {
    setShowForm(false);
    setEditingDestination(null);
    setError(null); // Clear errors
  };

  return (
    <div className="chandan-containers">
      <div className="app-container">
        <header className="app-header">
          <h1>Travel Destination Manager</h1> {/* Restored header */}
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) setEditingDestination(null); // Clear editing state when closing
            }}
            aria-label={showForm ? 'Cancel form' : 'Add new destination'}
          >
            {showForm ? 'Cancel' : 'Add New Destination'}
          </button>
        </header>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {loading && <div className="loading">Loading destinations...</div>}

        {!loading && showForm ? (
          <DestinationUpload
            destination={editingDestination}
            onSuccess={
              editingDestination ? handleUpdateSuccess : handleCreateSuccess
            }
            onCancel={cancelForm}
          />
        ) : !loading && destinations.length > 0 ? (
          <DestinationList
            destinations={destinations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          !loading && (
            <div className="no-destinations">
              <p>No destinations found. Add your first destination!</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default MainUploadingDestination;