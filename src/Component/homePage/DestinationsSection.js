import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  // Structured Data for Destinations (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Popular Travel Destinations - TravelSansar',
    description: 'Explore the best travel destinations with TravelSansar. Book guided tours and vacation packages to top vacation spots around the globe.',
    url: 'https://travelsansar.com/destinations',
    publisher: {
      '@type': 'Organization',
      name: 'TravelSansar',
      logo: {
        '@type': 'ImageObject',
        url: 'https://travelsansar.com/logo.png',
      },
    },
    hasPart: destinations.map(dest => ({
      '@type': 'Place',
      name: dest.name,
      description: dest.description,
      image: dest.image && dest.image.startsWith('https') ? dest.image : `https://travelsansar.com${dest.image}`,
      url: `https://travelsansar.com/destination/${dest.id}`,
    })),
  };

  // Manage Meta Tags and Structured Data
  useEffect(() => {
    // Set document title
    document.title = loading
      ? 'Loading Destinations - TravelSansar'
      : error
      ? 'Error - TravelSansar Destinations'
      : 'Popular Travel Destinations - TravelSansar';

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    const descriptionContent = loading
      ? 'Loading top travel destinations from TravelSansar. Please wait.'
      : error
      ? 'An error occurred while loading destinations. Please try again.'
      : 'Discover top travel destinations with TravelSansar. Book guided tours and vacation packages to the best vacation spots worldwide.';
    if (metaDescription) {
      metaDescription.content = descriptionContent;
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = descriptionContent;
      document.head.appendChild(meta);
    }

    // Set meta keywords (only for non-loading/error states)
    if (!loading && !error) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      const keywordsContent = 'travel destinations, vacation spots, guided tours, travel agency, TravelSansar, adventure travel, vacation packages';
      if (metaKeywords) {
        metaKeywords.content = keywordsContent;
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = keywordsContent;
        document.head.appendChild(meta);
      }
    }

    // Set robots meta tag
    const metaRobots = document.querySelector('meta[name="robots"]');
    const robotsContent = loading || error ? 'noindex' : 'index, follow';
    if (metaRobots) {
      metaRobots.content = robotsContent;
    } else {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = robotsContent;
      document.head.appendChild(meta);
    }

    // Set canonical link
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!loading && !error) {
      if (canonicalLink) {
        canonicalLink.href = 'https://travelsansar.com/destinations';
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = 'https://travelsansar.com/destinations';
        document.head.appendChild(link);
      }
    }

    // Add structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    if (!loading && !error) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup on unmount
    return () => {
      if (!loading && !error) {
        const script = document.querySelector('script[type="application/ld+json"]');
        if (script) document.head.removeChild(script);
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) document.head.removeChild(canonical);
        const keywords = document.querySelector('meta[name="keywords"]');
        if (keywords) document.head.removeChild(keywords);
      }
    };
  }, [loading, error, destinations, structuredData]);

  // Function to check if destination is new (within last 7 days)
  const isNewDestination = (createdAt) => {
    const destinationDate = new Date(createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - destinationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

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
            {[...Array(3)].map((_, index) => (
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
            <svg className="dg-error-icon" viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"></circle>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"></line>
              <line x1="12" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="2"></line>
            </svg>
            <h2 className="dg-error-title">Failed to Load Destinations</h2>
            <p className="dg-error-message">{error}</p>
            <button className="dg-btn-retry" onClick={() => window.location.reload()}>
              <svg viewBox="0 0 24 24" width="16" height="16" className="dg-retry-icon" aria-hidden="true">
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
            <h1 className="dg-section-title">Popular Travel Destinations</h1>
            <p className="dg-section-subtitle">Discover the best vacation spots around the globe with TravelSansar</p>
          </div>
          <div className="dg-no-destinations">
            <svg className="dg-empty-icon" viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"
              />
            </svg>
            <p className="dg-empty-message">No destinations found. Check back later for exciting new vacation spots!</p>
          </div>
        </div>
      </section>
    );
  }

  // Show only first 3 destinations
  const displayedDestinations = destinations.slice(0, 3);

  return (
    <section className="dg-destinations-section">
      <div className="dg-container">
        <div className="dg-section-header">
          <h1 className="dg-section-title">Popular Travel Destinations</h1>
          <p className="dg-section-subtitle">Discover the best vacation spots around the globe with TravelSansar</p>
        </div>

        <div className="dg-destinations-grid">
          {displayedDestinations.map(destination => (
            <article className="dg-destination-card" key={destination.id}>
              <div className="dg-card-image-container">
                <img
                  src={
                    destination.image && destination.image.startsWith('https')
                      ? destination.image
                      : destination.image
                      ? `${destination.image}`
                      : '/placeholder-image.jpg'
                  }
                  alt={`Explore ${destination.name} - Top Travel Destination by TravelSansar`}
                  className="dg-card-image"
                  loading="lazy"
                  sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 33vw"
                />
                {isNewDestination(destination.createdAt) && (
                  <div className="dg-card-new-badge">
                    <span>New</span>
                  </div>
                )}
              </div>

              <div className="dg-card-content">
                <h2 className="dg-card-title">
                  <Link to={`/destination/${destination.id}`}>{destination.name}</Link>
                </h2>

                <p className="dg-card-description">
                  {destination.description && destination.description.length > 80
                    ? `${destination.description.substring(0, 80)}...`
                    : destination.description}
                </p>

                {destination.bestTimeToVisit && (
                  <div className="dg-card-meta">
                    <div className="dg-meta-item">
                      <svg className="dg-meta-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"
                        />
                      </svg>
                      <span>Best time: {destination.bestTimeToVisit}</span>
                    </div>
                  </div>
                )}

                <Link to={`/destination/${destination.id}`} className="dg-card-button">
                  Explore Destination
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="dg-section-footer">
          <Link to="/destinations" className="dg-view-all-button">
            <span>View All Travel Destinations</span>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DestinationsGrid;