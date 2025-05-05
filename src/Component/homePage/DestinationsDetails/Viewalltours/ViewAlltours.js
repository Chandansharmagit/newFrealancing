import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { setMetaTags } from '../../ViewallDestinations/Utils/setMetaTags';
import './ViewAllTours.css';
import Footer from '../../Footer';

const ViewAllTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    duration: '',
    priceRange: '',
    isPackage: false,
  });

  // Fetch tours data
  const fetchTours = async (signal) => {
    try {
      setLoading(true);
      const response = await fetch('https://backendtravelagencytwomicroservice.onrender.com/api/tours', { signal });
      if (!response.ok) {
        throw new Error(`Failed to fetch tours: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const mappedTours = data
        .map(tour => ({
          id: tour._id,
          name: tour.name,
          description: tour.description,
          duration: tour.duration,
          price: tour.price,
          image: tour.images && tour.images.length > 0
            ? (tour.images.find(img => img.isFeatured)?.url || tour.images[0].url)
            : '/images/placeholder.jpg',
          createdAt: tour.createdAt || new Date().toISOString(),
          isPackage: tour.isPackage || tour.price > 1000,
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setTours(mappedTours);
    } catch (err) {
      if (!signal.aborted) {
        console.error('Error fetching tours:', err);
        setError(err.message || 'Failed to load tours');
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchTours(controller.signal);
    return () => controller.abort();
  }, []);

  // Structured Data for Tours (JSON-LD)
  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'All Tours - TravelSansar',
      description: 'Explore all travel tours and premium packages with TravelSansar. Book your perfect journey to exciting destinations.',
      url: 'https://travelsansar.com/tours',
      publisher: {
        '@type': 'Organization',
        name: 'TravelSansar',
        logo: {
          '@type': 'ImageObject',
          url: 'https://travelsansar.com/logo.png',
        },
      },
      hasPart: tours.map(tour => ({
        '@type': 'TouristTrip',
        name: tour.name,
        description: tour.description,
        image: tour.image && tour.image.startsWith('https') ? tour.image : `https://travelsansar.com${tour.image}`,
        url: `https://travelsansar.com/tour/${tour.id}`,
        offers: {
          '@type': 'Offer',
          price: tour.price,
          priceCurrency: 'USD',
          url: `https://travelsansar.com/tour/${tour.id}`,
          availability: 'https://schema.org/InStock',
          category: tour.isPackage ? 'Travel Package' : 'Standard Tour',
        },
      })),
    }),
    [tours]
  );

  // Manage Meta Tags and Structured Data
  useEffect(() => {
    const metaConfig = {
      title: loading
        ? 'Loading Tours - TravelSansar'
        : error
        ? 'Error - TravelSansar Tours'
        : 'All Tours - TravelSansar',
      description: loading
        ? 'Loading all tours from TravelSansar. Please wait.'
        : error
        ? 'An error occurred while loading tours. Please try again.'
        : 'Explore all travel tours and premium packages with TravelSansar. Book your perfect journey to exciting destinations.',
      keywords: !loading && !error
        ? 'travel tours, guided tours, travel packages, TravelSansar, adventure tours, tour itineraries'
        : undefined,
      robots: loading || error ? 'noindex' : 'index, follow',
      canonical: !loading && !error ? 'https://travelsansar.com/tours' : undefined,
      structuredData: !loading && !error ? structuredData : undefined,
    };

    const cleanup = setMetaTags(metaConfig);
    return cleanup;
  }, [loading, error, tours, structuredData]);

  // Filter tours
  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
      const matchesSearch = tour.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesDuration = filters.duration
        ? (filters.duration === 'short' && tour.duration.includes('1-3'))
        || (filters.duration === 'medium' && tour.duration.includes('4-7'))
        || (filters.duration === 'long' && tour.duration.includes('8+'))
        : true;
      const matchesPrice = filters.priceRange
        ? (filters.priceRange === 'budget' && tour.price <= 500)
        || (filters.priceRange === 'mid-range' && tour.price > 500 && tour.price <= 1500)
        || (filters.priceRange === 'premium' && tour.price > 1500)
        : true;
      const matchesPackage = filters.isPackage ? tour.isPackage : true;
      return matchesSearch && matchesDuration && matchesPrice && matchesPackage;
    });
  }, [tours, filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ search: '', duration: '', priceRange: '', isPackage: false });
  };

  // Retry fetch on error
  const retryFetch = () => {
    setError(null);
    setLoading(true);
    const controller = new AbortController();
    fetchTours(controller.signal);
    return () => controller.abort();
  };

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
      <section className="view-all-tours-section" aria-busy="true">
        <div className="view-all-tours-container">
          <div className="view-all-tours-header">
            <div className="view-all-tours-skeleton-header"></div>
            <div className="view-all-tours-skeleton-subheader"></div>
          </div>
          <div className="view-all-tours-grid">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="view-all-tours-skeleton-card">
                <div className="view-all-tours-skeleton-image"></div>
                <div className="view-all-tours-skeleton-content">
                  <div className="view-all-tours-skeleton-title"></div>
                  <div className="view-all-tours-skeleton-text"></div>
                  <div className="view-all-tours-skeleton-footer"></div>
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
      <section className="view-all-tours-section">
        <div className="view-all-tours-container">
          <div className="view-all-tours-error-container">
            <svg className="view-all-tours-error-icon" viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"></circle>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"></line>
              <line x1="12" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="2"></line>
            </svg>
            <h2 className="view-all-tours-error-title">Failed to Load Tours</h2>
            <p className="view-all-tours-error-message">{error}</p>
            <button className="view-all-tours-btn-retry" onClick={retryFetch}>
              <svg viewBox="0 0 24 24" width="16" height="16" className="view-all-tours-retry-icon" aria-hidden="true">
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
  if (filteredTours.length === 0) {
    return (
      <section className="view-all-tours-section">
        <div className="view-all-tours-container">
          <div className="view-all-tours-header">
            <h1 className='exp'>All Tours</h1>
            <p className='exp'>Explore all travel tours and premium packages with TravelSansar</p>
          </div>
          <div className="view-all-tours-no-tours">
            <svg className="view-all-tours-empty-icon" viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"
              />
            </svg>
            <p className="view-all-tours-empty-message">
              {tours.length === 0
                ? 'No tours found. Check back later for exciting new adventures!'
                : 'No tours match your filters. Try adjusting or resetting the filters.'}
            </p>
            {tours.length > 0 && (
              <button className="view-all-tours-btn-reset" onClick={resetFilters}>
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>

    <section className="view-all-tours-section">
      <div className="view-all-tours-container">
        <div className="view-all-tours-header">
          <h1>All Tours</h1>
          <p>Explore all travel tours and premium packages with TravelSansar</p>
        </div>

        <div className="view-all-tours-filters">
          <div className="view-all-tours-filter-group">
            <label htmlFor="search">Search Tours</label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by tour name..."
              className="view-all-tours-filter-input"
              aria-label="Search tours by name"
            />
          </div>
          <div className="view-all-tours-filter-group">
            <label htmlFor="duration">Duration</label>
            <select
              id="duration"
              name="duration"
              value={filters.duration}
              onChange={handleFilterChange}
              className="view-all-tours-filter-select"
              aria-label="Filter tours by duration"
            >
              <option value="">All Durations</option>
              <option value="short">Short (1-3 days)</option>
              <option value="medium">Medium (4-7 days)</option>
              <option value="long">Long (8+ days)</option>
            </select>
          </div>
          <div className="view-all-tours-filter-group">
            <label htmlFor="priceRange">Price Range</label>
            <select
              id="priceRange"
              name="priceRange"
              value={filters.priceRange}
              onChange={handleFilterChange}
              className="view-all-tours-filter-select"
              aria-label="Filter tours by price range"
            >
              <option value="">All Prices</option>
              <option value="budget">Budget ($0-$500)</option>
              <option value="mid-range">Mid-Range ($501-$1500)</option>
              <option value="premium">Premium ($1501+)</option>
            </select>
          </div>
          <div className="view-all-tours-filter-group view-all-tours-filter-checkbox">
            <input
              type="checkbox"
              id="isPackage"
              name="isPackage"
              checked={filters.isPackage}
              onChange={handleFilterChange}
              className="view-all-tours-filter-checkbox-input"
              aria-label="Show only package tours"
            />
            <label htmlFor="isPackage">Show Package Tours Only</label>
          </div>
          <button
            className="view-all-tours-btn-reset"
            onClick={resetFilters}
            disabled={!filters.search && !filters.duration && !filters.priceRange && !filters.isPackage}
            aria-label="Reset all filters"
          >
            Reset Filters
          </button>
        </div>

        <div className="view-all-tours-grid">
          {filteredTours.map((tour) => (
            <article className="view-all-tours-tour-card" key={tour.id}>
              <div className="view-all-tours-tour-image">
                <img
                  src={tour.image}
                  alt={`Explore ${tour.name} - TravelSansar Tour`}
                  loading="lazy"
                  className="view-all-tours-tour-img"
                />
                {isNewTour(tour.createdAt) && (
                  <div className="view-all-tours-tour-new-badge" aria-label="New tour">
                    <span>New</span>
                  </div>
                )}
                {tour.isPackage && (
                  <div className="view-all-tours-tour-package-badge" aria-label="Premium package tour">
                    <span>Package</span>
                  </div>
                )}
                <div className="view-all-tours-tour-duration" aria-label={`Tour duration: ${tour.duration}`}>
                  {tour.duration}
                </div>
              </div>
              <div className="view-all-tours-tour-info">
                <h3 className="view-all-tours-tour-title">{tour.name}</h3>
                <p className="view-all-tours-tour-description">
                  {tour.description.length > 80 ? `${tour.description.substring(0, 80)}...` : tour.description}
                </p>
                <div className="view-all-tours-tour-footer">
                  <span className="view-all-tours-tour-price">${tour.price}</span>
                  <Link
                    to={`/tour/${tour.id}`}
                    className="view-all-tours-btn-details"
                    aria-label={`View details for ${tour.name}`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
    <Footer/>
    </>
  );
};

export default ViewAllTours;