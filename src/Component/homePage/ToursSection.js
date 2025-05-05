import React, { useState, useEffect } from 'react';
import './ToursSection.css';

const ToursSection = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTours = async () => {
      try {
        const response = await fetch('https://backendtravelagencytwomicroservice.onrender.com/api/tours', { signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch tours: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const mappedTours = data.map(tour => ({
          id: tour._id,
          name: tour.name,
          description: tour.description,
          duration: tour.duration,
          price: tour.price,
          image: tour.images && tour.images.length > 0 
            ? (tour.images.find(img => img.isFeatured)?.url || tour.images[0].url)
            : '/images/placeholder.jpg',
          createdAt: tour.createdAt || new Date().toISOString(),
        }));

        // Sort by createdAt date, newest first
        mappedTours.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setTours(mappedTours);
      } catch (err) {
        if (!signal.aborted) {
          setError(err.message || 'Failed to load tours');
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTours();

    return () => controller.abort();
  }, []);

  // Function to check if tour is new (within last 7 days)
  const isNewTour = (createdAt) => {
    const tourDate = new Date(createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - tourDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Render loading state
  if (loading) {
    return (
      <section className="tours-section">
        <div className="tours-section-container">
          <div className="tours-section-header">
            <div className="tours-section-skeleton-header"></div>
            <div className="tours-section-skeleton-subheader"></div>
          </div>
          <div className="tours-section-grid">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="tours-section-skeleton-card">
                <div className="tours-section-skeleton-image"></div>
                <div className="tours-section-skeleton-content">
                  <div className="tours-section-skeleton-title"></div>
                  <div className="tours-section-skeleton-text"></div>
                  <div className="tours-section-skeleton-footer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Render error state
  if (error) {
    return (
      <section className="tours-section">
        <div className="tours-section-container">
          <div className="tours-section-error-container">
            <svg className="tours-section-error-icon" viewBox="0 0 24 24" width="40" height="40">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"></circle>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"></line>
              <line x1="12" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="2"></line>
            </svg>
            <h2 className="tours-section-error-title">Failed to Load Tours</h2>
            <p className="tours-section-error-message">{error}</p>
            <button className="tours-section-btn-retry" onClick={() => window.location.reload()}>
              <svg viewBox="0 0 24 24" width="16" height="16" className="tours-section-retry-icon">
                <path
                  fill="currentColor"
                  d="M17.65 6.35C16.2 4.9 14.2 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                />
              </svg>
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Render empty state
  if (tours.length === 0) {
    return (
      <section className="tours-section">
        <div className="tours-section-container">
          <div className="tours-section-header">
            <h2>Featured Tours</h2>
            <p>Handcrafted itineraries to create your perfect journey</p>
          </div>
          <div className="tours-section-no-tours">
            <svg className="tours-section-empty-icon" viewBox="0 0 24 24" width="48" height="48">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"
              />
            </svg>
            <p className="tours-section-empty-message">No tours found. Check back later for exciting new adventures!</p>
          </div>
        </div>
      </section>
    );
  }

  // Show only first 3 tours
  const displayedTours = tours.slice(0, 3);

  return (
    <section className="tours-section">
      <div className="tours-section-container">
        <div className="tours-section-header">
          <h2>Featured Tours</h2>
          <p>Handcrafted itineraries to create your perfect journey</p>
        </div>

        <div className="tours-section-grid">
          {displayedTours.map((tour) => (
            <div className="tours-section-tour-card" key={tour.id}>
              <div className="tours-section-tour-image">
                <img src={tour.image} alt={tour.name} />
                {isNewTour(tour.createdAt) && (
                  <div className="tours-section-tour-new-badge">
                    <span>New</span>
                  </div>
                )}
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

        <div className="tours-section-footer">
          <a href="/view-all-tours" className="tours-section-view-all-button">
            <span>View All Tours</span>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ToursSection;