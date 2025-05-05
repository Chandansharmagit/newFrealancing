import React, { useState, useEffect } from 'react';
import './ViewAllDestinations.css';

import { motion } from 'framer-motion';

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
  const [isScrolled, setIsScrolled] = useState(false);

  const itemsPerPage = 9;

  // Handle scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch destinations data
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://backendtravelagency.onrender.com/api/destinations', { signal });

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

  // Generate pagination range with ellipsis
  const getPaginationRange = () => {
    const range = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // Always show first page
      range.push(1);
      
      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust for edge cases
      if (currentPage <= 3) {
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis before if needed
      if (startPage > 2) {
        range.push('...');
      }
      
      // Add pages in range
      for (let i = startPage; i <= endPage; i++) {
        range.push(i);
      }
      
      // Add ellipsis after if needed
      if (endPage < totalPages - 1) {
        range.push('...');
      }
      
      // Always show last page
      range.push(totalPages);
    }
    
    return range;
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
              <motion.div 
                key={index} 
                className="vad-skeleton-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="vad-skeleton-image"></div>
                <div className="vad-skeleton-content">
                  <div className="vad-skeleton-title"></div>
                  <div className="vad-skeleton-text"></div>
                  <div className="vad-skeleton-meta"></div>
                </div>
              </motion.div>
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
          <div className={`vad-section-header ${isScrolled ? 'vad-scrolled' : ''}`}>
            <h2 className="vad-section-title">All Destinations</h2>
            <p className="vad-section-subtitle">Explore our complete collection of vacation spots</p>
          </div>
          
          {/* Filter section */}
          <button className="vad-filter-toggle" onClick={toggleFilter}>
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            <svg viewBox="0 0 24 24" width="16" height="16" className="vad-filter-icon">
              <path
                fill="currentColor"
                d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"
              />
            </svg>
          </button>

          <div className={`vad-filter-container ${isFilterOpen ? 'vad-open' : ''}`}>
            <div className="vad-filter-wrapper">
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
          </div>
          
          <div className="vad-no-destinations">
            <svg className="vad-empty-icon" viewBox="0 0 24 24" width="64" height="64">
              <path
                fill="currentColor"
                d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
              />
            </svg>
            <p className="vad-empty-message">No destinations match your filters. Try adjusting or check back later!</p>
            <button
              onClick={() => setFilters({ location: '', bestTimeToVisit: '', activities: '' })}
              className="vad-btn-clear-empty"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
    <section className="vad-destinations-section">
      <div className="vad-container">
        <div className={`vad-section-header ${isScrolled ? 'vad-scrolled' : ''}`}>
          <h2 className="vad-section-title">All Destinations</h2>
          <p className="vad-section-subtitle">Explore our complete collection of vacation spots</p>
        </div>

        {/* Summary stats */}
        <div className="vad-stats-bar">
          <div className="vad-stat">
            <span className="vad-stat-number">{filteredDestinations.length}</span>
            <span className="vad-stat-label">Destinations</span>
          </div>
          <div className="vad-stat">
            <span className="vad-stat-number">{currentPage}/{totalPages}</span>
            <span className="vad-stat-label">Pages</span>
          </div>
        </div>

        {/* Filter Toggle Button */}
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
          <div className="vad-filter-wrapper">
            <div className="vad-filter-group">
              <label htmlFor="vad-location" className="vad-filter-label">
                Location
              </label>
              <div className="vad-input-wrapper">
                <svg className="vad-input-icon" viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  />
                </svg>
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
            </div>
            <div className="vad-filter-group">
              <label htmlFor="vad-bestTimeToVisit" className="vad-filter-label">
                Best Time to Visit
              </label>
              <div className="vad-input-wrapper">
                <svg className="vad-input-icon" viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"
                  />
                </svg>
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
            </div>
            <div className="vad-filter-group">
              <label htmlFor="vad-activities" className="vad-filter-label">
                Activities
              </label>
              <div className="vad-input-wrapper">
                <svg className="vad-input-icon" viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"
                  />
                </svg>
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
            </div>
            {(filters.location || filters.bestTimeToVisit || filters.activities) && (
              <button
                onClick={() => setFilters({ location: '', bestTimeToVisit: '', activities: '' })}
                className="vad-btn-clear"
              >
                <svg className="vad-clear-icon" viewBox="0 0 24 24" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        {filters.location || filters.bestTimeToVisit || filters.activities ? (
          <div className="vad-results-count">
            Found <span>{filteredDestinations.length}</span> destinations
          </div>
        ) : null}

        {/* Destinations Grid */}
        <div className="vad-destinations-grid">
          {currentDestinations.map((destination, index) => (
            <motion.article 
              className="vad-destination-card" 
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="vad-card-image-container">
                <img
                  src={
                    destination.image && destination.image.startsWith('http')
                      ? destination.image
                      : `https://backendtravelagency.onrender.com/${destination.image}`
                  }
                  alt={`Visit ${destination.name}`}
                  className="vad-card-image"
                  loading="lazy"
                />
                <div className="vad-card-overlay">
                  <a href={`/destination/${destination.id}`} className="vad-card-overlay-button">
                    View Details
                  </a>
                </div>
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
                <div className="vad-card-meta">
                  {destination.bestTimeToVisit && (
                    <div className="vad-meta-item">
                      <svg className="vad-meta-icon" viewBox="0 0 24 24" width="14" height="14">
                        <path
                          fill="currentColor"
                          d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"
                        />
                      </svg>
                      <span>Best time: {destination.bestTimeToVisit}</span>
                    </div>
                  )}
                  {destination.thingsToDo && destination.thingsToDo.length > 0 && (
                    <div className="vad-meta-item vad-activities-count">
                      <svg className="vad-meta-icon" viewBox="0 0 24 24" width="14" height="14">
                        <path
                          fill="currentColor"
                          d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"
                        />
                      </svg>
                      <span>{destination.thingsToDo.length} Activities</span>
                    </div>
                  )}
                </div>
                <a href={`/destination/${destination.id}`} className="vad-card-button">
                  Explore
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="vad-pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="vad-pagination-button vad-pagination-arrow"
              aria-label="Previous page"
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            
            <div className="vad-pagination-numbers">
              {getPaginationRange().map((page, index) => 
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="vad-pagination-ellipsis">...</span>
                ) : (
                  <button
                    key={`page-${page}`}
                    onClick={() => handlePageChange(page)}
                    className={`vad-pagination-button ${currentPage === page ? 'vad-active' : ''}`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="vad-pagination-button vad-pagination-arrow"
              aria-label="Next page"
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Scroll to top button */}
        {isScrolled && (
          <button 
            className="vad-scroll-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
            </svg>
          </button>
        )}
      </div>
    </section>

    </>
  );
};

export default ViewAllDestinations;