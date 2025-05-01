import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ToursPage.css';

const ToursPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('https://backendtravelagencytwomicroservice.onrender.com/api/tours');
        if (!response.ok) {
          throw new Error('Failed to fetch tours');
        }
        const data = await response.json();
        setTours(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) return <div className="loading">Loading tours...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Placeholder image for tours without valid images
  const placeholderImage = '/path/to/placeholder.jpg'; // Replace with an actual placeholder image path

  return (
    <div className="tours-container">
      <div className="tours-header">
        <h1>Our Tours</h1>
        <button 
          className="create-button"
          onClick={() => navigate('/create-tour')}
        >
          Create New Tour
        </button>
      </div>

      <div className="tours-grid">
        {tours.map((tour) => (
          <div 
            key={tour._id} 
            className="tour-card"
            onClick={() => navigate(`/tours/${tour._id}`)}
          >
            {tour.images && tour.images.length > 0 ? (
              <img 
                src={
                  tour.images[0].url 
                    ? `https://backendtravelagencytwomicroservice.onrender.com${tour.images[0].url}` 
                    : tour.images[0].originalName 
                      ? `https://backendtravelagencytwomicroservice.onrender.com/uploads/${tour.images[0].originalName}` 
                      : placeholderImage
                }
                alt={tour.name}
                className="tour-image"
              
              />
            ) : (
              <img 
                src={placeholderImage}
                alt={tour.name}
                className="tour-image"
              />
            )}
            <div className="tour-info">
              <h2>{tour.name}</h2>
              <p className="tour-price">${tour.price}</p>
              <p className="tour-duration">{tour.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToursPage;