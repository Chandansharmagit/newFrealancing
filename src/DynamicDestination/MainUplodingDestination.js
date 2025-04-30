import React, { useState, useEffect } from "react";
import DestinationList from "./DestinationList";
import DestinationForm from "./DestinationForm";
import "./Apps.css";
import DestinationUpload from "../DashboardComponent/DestinatonUpload";

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
        const response = await fetch("http://localhost:5000/api/destinations");
        const data = await response.json();

        if (data.success) {
          setDestinations(data.destinations);
        } else {
          setError(data.message || "Failed to fetch destinations");
        }
      } catch (err) {
        setError("Error connecting to the server");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [refreshTrigger]);

  const handleCreateSuccess = () => {
    setShowForm(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleUpdateSuccess = () => {
    setEditingDestination(null);
    setShowForm(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEdit = (destination) => {
    setEditingDestination(destination);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this destination? All associated files will be permanently removed."
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/destinations/${id}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json();

        if (data.success) {
          setDestinations(destinations.filter((dest) => dest._id !== id));
          alert("Destination deleted successfully");
        } else {
          alert(data.message || "Failed to delete destination");
        }
      } catch (err) {
        alert("Error connecting to the server");
        console.error(err);
      }
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingDestination(null);
  };

  return (
    <div className="chandan-containers">
      <div className="app-container">
        <header className="app-header">
          {/* <h1>Travel Destination Manager</h1> */}
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add New Destination"}
          </button>
        </header>

        {error && <div className="error-message">{error}</div>}

        {showForm ? (
          <DestinationUpload />
        ) : loading ? (
          <div className="loading">Loading destinations...</div>
        ) : destinations.length > 0 ? (
          <DestinationList
            destinations={destinations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="no-destinations">
            <p>No destinations found. Add your first destination!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainUploadingDestination;
