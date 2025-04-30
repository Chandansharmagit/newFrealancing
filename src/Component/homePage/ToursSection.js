import React, { useState, useEffect } from 'react';
import './ToursSection.css';

const ToursSection = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tours');
        if (!response.ok) {
          throw new Error('Failed to fetch tours');
        }
        const data = await response.json();
        const mappedTours = data.map(tour => ({
          id: tour._id,
          name: tour.name,
          description: tour.description,
          duration: tour.duration,
          price: tour.price,
          image: tour.images && tour.images.length > 0 
            ? `http://localhost:5000${tour.images[0].url || `/uploads/${tour.images[0].originalName}`}`
            : '/images/placeholder.jpg'
        }));
        setTours(mappedTours);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) return <div className="tours-section-loading">Loading tours...</div>;
  if (error) return <div className="tours-section-error">Error: {error}</div>;

  return (
    <section className="tours-section">
      <div className="tours-section-container">
        <div className="tours-section-header">
          <h2>Featured Tours</h2>
          <p>Handcrafted itineraries to create your perfect journey</p>
        </div>
        
        <div className="tours-section-grid">
          {tours.map((tour) => (
            <div className="tours-section-tour-card" key={tour.id}>
              <div className="tours-section-tour-image">
                <img src={tour.image} alt={tour.name} />
                <div className="tours-section-tour-duration">{tour.duration}</div>
              </div>
              <div className="tours-section-tour-info">
                <h3>{tour.name}</h3>
                <p>{tour.description}</p>
                <div className="tours-section-tour-footer">
                  <span className="tours-section-tour-price">${tour.price}</span>
                  <a href={`/tour/${tour.id}`} className="tours-section-btn-details">View Details</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToursSection;