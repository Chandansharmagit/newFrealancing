import React, { useState, useEffect } from 'react';
import './ViewAllDestinations.css';
import Footer from '../Footer';

const ViewAllDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    location: '',
    bestTimeToVisit: '',
    activities: '',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const itemsPerPage = 9;

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

          formattedDestinations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setDestinations(formattedDestinations);
          setFilteredDestinations(formattedDestinations);
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

  // Handle filters
  useEffect(() => {
    let filtered = destinations;

    if (filters.location) {
      filtered = filtered.filter(dest =>
        dest.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.bestTimeToVisit) {
      filtered = filtered.filter(dest =>
        dest.bestTimeToVisit.toLowerCase().includes(filters.bestTimeToVisit.toLowerCase())
      );
    }

    if (filters.activities) {
      filtered = filtered.filter(dest =>
        dest.thingsToDo.some(activity =>
          activity.toLowerCase().includes(filters.activities.toLowerCase())
        )
      );
    }

    setFilteredDestinations(filtered);
    setCurrentPage(1);
  }, [filters, destinations]);

  // Pagination
  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDestinations = filteredDestinations.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = page => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const toggleFilter = () => {
    setIsFilterOpen(prev => !prev);
  };

  // Render loading state
  if (loading) {
    return (
      <section className="vad-destinations-section">
        <div className="vad-container">
          <div className="vad-section-header">
            <div className="vad-skeleton-header"></div>
            <div className="vad-skeleton-subheader"></div>
          </div>
          <div className="vad-destinations-grid">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="vad-skeleton-card">
                <div className="vad-skeleton-image"></div>
                <div className="vad-skeleton-content">
                  <div className="vad-skeleton-title"></div>
                  <div className="vad-skeleton-text"></div>
                  <div className="vad-skeleton-meta"></div>
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
      <section className="vad-destinations-section">
        <div className="vad-container">
          <div className="vad-error-container">
            <svg className="vad-error-icon" viewBox="0 0 24 24" width="48" height="48">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"></circle>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"></line>
              <line x1="12" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="2"></line>
            </svg>
            <h2 className="vad-error-title">Failed to Load Destinations</h2>
            <p className="vad-error-message">{error}</p>
            <button className="vad-btn-retry" onClick={() => window.location.reload()}>
              <svg viewBox="0 0 24 24" width="16" height="16" className="vad-retry-icon">
                <path
                  fill="currentColor"
                  d="M17.65 6.35C16.2 4.9 14.2 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Render empty state
  if (filteredDestinations.length === 0) {
    return (
      <section className="vad-destinations-section">
        <div className="vad-container">
          <div className="vad-section-header">
            <h2 className="vad-section-title">All Destinations</h2>
            <p className="vad-section-subtitle">Explore our complete collection of vacation spots</p>
          </div>
          <div className="vad-no-destinations">
            <svg className="vad-empty-icon" viewBox="0 0 24 24" width="48" height="48">
              {/* <Bench
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"
              /> */}
            </svg>
            <p className="vad-empty-message">No destinations match your filters. Try adjusting or check back later!</p>
            {/* <button
              onClick={() => setFilters({ location: '', bestTimeToVisit: '', activities: '' })}
              className="vad-btn-clear"
            >
              Clear Filters
            </button> */}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>

    <section className="vad-destinations-section">
      <div className="vad-container">
        <div className="vad-section-header">
          <h2 className="vad-section-title">All Destinations</h2>
          <p className="vad-section-subtitle">Explore our complete collection of vacation spots</p>
        </div>

        {/* Filter Toggle Button for Mobile */}
        <button className="vad-filter-toggle" onClick={toggleFilter}>
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          <svg viewBox="0 0 24 24" width="16" height="16" className="vad-filter-icon">
            <path
              fill="currentColor"
              d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"
            />
          </svg>
        </button>

        {/* Filters */}
        <div className={`vad-filter-container ${isFilterOpen ? 'vad-open' : ''}`}>
          <div className="vad-filter-group">
            <label htmlFor="vad-location" className="vad-filter-label">
              Location
            </label>
            <input
              type="text"
              id="vad-location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="e.g., Paris, Japan"
              className="vad-filter-input"
            />
          </div>
          <div className="vad-filter-group">
            <label htmlFor="vad-bestTimeToVisit" className="vad-filter-label">
              Best Time to Visit
            </label>
            <input
              type="text"
              id="vad-bestTimeToVisit"
              name="bestTimeToVisit"
              value={filters.bestTimeToVisit}
              onChange={handleFilterChange}
              placeholder="e.g., Summer, Winter"
              className="vad-filter-input"
            />
          </div>
          <div className="vad-filter-group">
            <label htmlFor="vad-activities" className="vad-filter-label">
              Activities
            </label>
            <input
              type="text"
              id="vad-activities"
              name="activities"
              value={filters.activities}
              onChange={handleFilterChange}
              placeholder="e.g., Hiking, Beaches"
              className="vad-filter-input"
            />
          </div>
          {(filters.location || filters.bestTimeToVisit || filters.activities) && (
            <button
              onClick={() => setFilters({ location: '', bestTimeToVisit: '', activities: '' })}
              className="vad-btn-clear"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Destinations Grid */}
        <div className="vad-destinations-grid">
          {currentDestinations.map(destination => (
            <article className="vad-destination-card" key={destination.id}>
              <div className="vad-card-image-container">
                <img
                  src={
                    destination.image && destination.image.startsWith('http')
                      ? destination.image
                      : `http://localhost:5001/${destination.image}`
                  }
                  alt={`Visit ${destination.name}`}
                  className="vad-card-image"
                  loading="lazy"
                />
                {destination.location && (
                  <div className="vad-card-badge">
                    <svg className="vad-badge-icon" viewBox="0 0 24 24" width="14" height="14">
                      <path
                        fill="currentColor"
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                      />
                    </svg>
                    <span>{destination.location}</span>
                  </div>
                )}
              </div>
              <div className="vad-card-content">
                <h3 className="vad-card-title">
                  <a href={`/destination/${destination.id}`}>{destination.name}</a>
                </h3>
                <p className="vad-card-description">
                  {destination.description && destination.description.length > 100
                    ? `${destination.description.substring(0, 100)}...`
                    : destination.description}
                </p>
                {destination.bestTimeToVisit && (
                  <div className="vad-card-meta">
                    <div className="vad-meta-item">
                      <svg className="vad-meta-icon" viewBox="0 0 24 24" width="14" height="14">
                        <path
                          fill="currentColor"
                          d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"
                        />
                      </svg>
                      <span>Best time: {destination.bestTimeToVisit}</span>
                    </div>
                  </div>
                )}
                <a href={`/destination/${destination.id}`} className="vad-card-button">
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="vad-pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="vad-pagination-button"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`vad-pagination-button ${currentPage === index + 1 ? 'vad-active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="vad-pagination-button"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
    <Footer/>
    </>
  );
};

export default ViewAllDestinations;