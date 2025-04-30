import React, { useState, useEffect } from 'react';
import './DestinationsSlider.css';

const DestinationsGrid = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch destinations data
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/destinations', { signal });

        if (!response.ok) {
          throw new Error(`Failed to fetch destinations: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
          const formattedDestinations = data.destinations.map(dest => ({
            id: dest._id,
            name: dest.title,
            image: dest.images && dest.images.length > 0 ? dest.images[0].path : '/placeholder-image.jpg',
            location: dest.location,
            description: dest.description,
            bestTimeToVisit: dest.bestTimeToVisit,
            thingsToDo: dest.thingsToDo,
            createdAt: dest.createdAt || new Date().toISOString(),
          }));

          // Sort by createdAt date, newest first
          formattedDestinations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          setDestinations(formattedDestinations);
        } else {
          throw new Error(data.message || 'Failed to fetch destinations');
        }
      } catch (err) {
        if (!signal.aborted) {
          console.error('Error fetching destinations:', err);
          setError(err.message || 'Failed to load destinations');
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchDestinations();

    return () => controller.abort();
  }, []);

  // Render loading skeleton
  if (loading) {
    return (
      <section className="dg-destinations-section">
        <div className="dg-container">
          <div className="dg-section-header">
            <div className="dg-skeleton-header"></div>
            <div className="dg-skeleton-subheader"></div>
          </div>

          <div className="dg-destinations-grid">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="dg-skeleton-card">
                <div className="dg-skeleton-image"></div>
                <div className="dg-skeleton-content">
                  <div className="dg-skeleton-title"></div>
                  <div className="dg-skeleton-text"></div>
                  <div className="dg-skeleton-meta"></div>
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
      <section className="dg-destinations-section">
        <div className="dg-container">
          <div className="dg-error-container">
            <svg className="dg-error-icon" viewBox="0 0 24 24" width="40" height="40">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"></circle>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"></line>
              <line x1="12" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="2"></line>
            </svg>
            <h2 className="dg-error-title">Failed to Load Destinations</h2>
            <p className="dg-error-message">{error}</p>
            <button className="dg-btn-retry" onClick={() => window.location.reload()}>
              <svg viewBox="0 0 24 24" width="16" height="16" className="dg-retry-icon">
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
  if (destinations.length === 0) {
    return (
      <section className="dg-destinations-section">
        <div className="dg-container">
          <div className="dg-section-header">
            <h2 className="dg-section-title">Popular Destinations</h2>
            <p className="dg-section-subtitle">Explore our most sought-after vacation spots around the globe</p>
          </div>
          <div className="dg-no-destinations">
            <svg className="dg-empty-icon" viewBox="0 0 24 24" width="48" height="48">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"
              />
            </svg>
            <p className="dg-empty-message">No destinations found. Check back later for exciting new locations!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="dg-destinations-section">
      <div className="dg-container">
        <div className="dg-section-header">
          <h2 className="dg-section-title">Popular Destinations</h2>
          <p className="dg-section-subtitle">Explore our most sought-after vacation spots around the globe</p>
        </div>

        <div className="dg-destinations-grid">
          {destinations.map(destination => (
            <article className="dg-destination-card" key={destination.id}>
              <div className="dg-card-image-container">
                <img
                  src={
                    destination.image && destination.image.startsWith('http')
                      ? destination.image
                      : destination.image
                      ? `http://localhost:5001/${destination.image}`
                      : '/placeholder-image.jpg'
                  }
                  alt={`Visit ${destination.name}`}
                  className="dg-card-image"
                  loading="lazy"
                  sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 33vw"
                />
                {/* Uncomment if location badge is needed
                {destination.location && (
                  <div className="dg-card-badge">
                    <svg className="dg-badge-icon" viewBox="0 0 24 24" width="14" height="14">
                      <path
                        fill="currentColor"
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                      />
                    </svg>
                    <span>{destination.location}</span>
                  </div>
                )}
                */}
              </div>

              <div className="dg-card-content">
                <h3 className="dg-card-title">
                  <a href={`/destination/${destination.id}`}>{destination.name}</a>
                </h3>

                <p className="dg-card-description">
                  {destination.description && destination.description.length > 80
                    ? `${destination.description.substring(0, 80)}...`
                    : destination.description}
                </p>

                {destination.bestTimeToVisit && (
                  <div className="dg-card-meta">
                    <div className="dg-meta-item">
                      <svg className="dg-meta-icon" viewBox="0 0 24 24" width="14" height="14">
                        <path
                          fill="currentColor"
                          d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"
                        />
                      </svg>
                      <span>Best time: {destination.bestTimeToVisit}</span>
                    </div>
                  </div>
                )}

                <a href={`/destination/${destination.id}`} className="dg-card-button">
                  Explore
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="dg-section-footer">
          <a href="/destinations" className="dg-view-all-button">
            <span>View All Destinations</span>
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

export default DestinationsGrid;