import React, { useState, useEffect, useMemo } from "react";
import "./DestinationsSlider.css";

// Real Link component
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

// Real setMetaTags function
const setMetaTags = (config) => {
  if (config.title) {
    document.title = config.title;
  }
  const description = document.querySelector('meta[name="description"]');
  if (description && config.description) {
    description.setAttribute("content", config.description);
  }
  const keywords = document.querySelector('meta[name="keywords"]');
  if (keywords && config.keywords) {
    keywords.setAttribute("content", config.keywords);
  }
  const robots = document.querySelector('meta[name="robots"]');
  if (robots && config.robots) {
    robots.setAttribute("content", config.robots);
  }
  if (config.structuredData) {
    const existingScript = document.getElementById("structured-data");
    if (existingScript) {
      existingScript.remove();
    }
    const script = document.createElement("script");
    script.id = "structured-data";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(config.structuredData);
    document.head.appendChild(script);
  }
  return () => {
    const structuredDataScript = document.getElementById("structured-data");
    if (structuredDataScript) {
      structuredDataScript.remove();
    }
  };
};

const DestinationsGrid = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "https://backendtravelagency.onrender.com/api/destinations",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch destinations: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      const destinationsData = Array.isArray(data)
        ? data
        : data.destinations || data.data || [];
      if (!Array.isArray(destinationsData)) {
        throw new Error("Invalid response format: Expected an array of destinations");
      }
      const transformedDestinations = destinationsData.map((dest) => {
        const transformed = {
          id: dest.id || dest._id,
          name: dest.name || dest.title,
          image: dest.images && dest.images.length > 0 ? decodeURIComponent(dest.images[0].path) : "/placeholder-image.jpg",
          location: dest.location || dest.country,
          description: dest.description || dest.summary,
          bestTimeToVisit: dest.bestTimeToVisit || dest.bestTime,
          thingsToDo: dest.thingsToDo || dest.activities || dest.attractions || [],
          createdAt: dest.createdAt || dest.created_at || new Date().toISOString(),
        };
        console.log("Transformed destination:", transformed); // Debug log
        return transformed;
      });
      setDestinations(transformedDestinations);
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setError(
        err.message || "Failed to load destinations. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Popular Travel Destinations - TravelSansar",
      description:
        "Explore the best travel destinations with TravelSansar. Book guided tours and vacation packages to top vacation spots around the globe.",
      url: "https://travelsansar.com/destinations",
      publisher: {
        "@type": "Organization",
        name: "TravelSansar",
        logo: {
          "@type": "ImageObject",
          url: "https://travelsansar.com/logo.png",
        },
      },
      hasPart: destinations.map((dest) => ({
        "@type": "Place",
        name: dest.name,
        description: dest.description,
        image: dest.image,
        url: `https://travelsansar.com/destination/${dest.id}`,
      })),
    }),
    [destinations]
  );

  useEffect(() => {
    const metaConfig = {
      title: loading
        ? "Loading Destinations - TravelSansar"
        : error
        ? "Error - TravelSansar Destinations"
        : "Popular Travel Destinations - TravelSansar",
      description: loading
        ? "Loading top travel destinations from TravelSansar. Please wait."
        : error
        ? "An error occurred while loading destinations. Please try again."
        : "Discover top travel destinations with TravelSansar. Book guided tours and vacation packages to the best vacation spots worldwide.",
      keywords:
        !loading && !error
          ? "travel destinations, vacation spots, guided tours, travel agency, TravelSansar, adventure travel, vacation packages"
          : undefined,
      robots: loading || error ? "noindex" : "index, follow",
      canonical:
        !loading && !error
          ? "https://travelsansar.com/destinations"
          : undefined,
      structuredData: !loading && !error ? structuredData : undefined,
    };
    const cleanup = setMetaTags(metaConfig);
    return cleanup;
  }, [loading, error, destinations, structuredData]);

  const isNewDestination = (createdAt) => {
    if (!createdAt) return false;
    try {
      const destinationDate = new Date(createdAt);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate - destinationDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    } catch (err) {
      console.warn("Invalid date format:", createdAt);
      return false;
    }
  };

  const retryFetch = () => {
    fetchDestinations();
  };

  const displayedDestinations = useMemo(
    () => destinations.slice(0, 3),
    [destinations]
  );

  if (loading) {
    return (
      <section
        className="modern-destinations-section"
        style={{
          "--mouse-x": `${mousePosition.x}%`,
          "--mouse-y": `${mousePosition.y}%`,
        }}
      >
        <div className="animated-background"></div>
        <div className="floating-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <div className="modern-container">
          <div className="section-header glass-card">
            <div className="skeleton-header"></div>
            <div className="skeleton-subheader"></div>
          </div>
          <div className="destinations-grid">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="skeleton-card glass-card">
                <div className="skeleton-image shimmer"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title shimmer"></div>
                  <div className="skeleton-text shimmer"></div>
                  <div className="skeleton-meta shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="modern-destinations-section error-state"
        style={{
          "--mouse-x": `${mousePosition.x}%`,
          "--mouse-y": `${mousePosition.y}%`,
        }}
      >
        <div className="animated-background error-bg"></div>
        <div className="modern-container">
          <div className="error-container glass-card">
            <div className="error-icon-container">
              <svg
                className="error-icon"
                viewBox="0 0 24 24"
                width="48"
                height="48"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                ></circle>
                <line
                  x1="12"
                  y1="8"
                  x2="12"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="2"
                ></line>
                <line
                  x1="12"
                  y1="16"
                  x2="12"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="2"
                ></line>
              </svg>
            </div>
            <h2 className="error-title">Oops! Something went wrong</h2>
            <p className="error-message">{error}</p>
            <button className="retry-button glass-button" onClick={retryFetch}>
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                className="retry-icon"
              >
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

  if (destinations.length === 0) {
    return (
      <section
        className="modern-destinations-section empty-state"
        style={{
          "--mouse-x": `${mousePosition.x}%`,
          "--mouse-y": `${mousePosition.y}%`,
        }}
      >
        <div className="animated-background"></div>
        <div className="modern-container">
          <div className="section-header glass-card">
            <h1 className="section-title gradient-text">
              Popular Travel Destinations
            </h1>
            <p className="section-subtitle">
              Discover the best vacation spots around the globe with TravelSansar
            </p>
          </div>
          <div className="empty-state-container glass-card">
            <div className="empty-icon-container">
              <svg
                className="empty-icon"
                viewBox="0 0 24 24"
                width="64"
                height="64"
              >
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"
                />
              </svg>
            </div>
            <p className="empty-message">
              No destinations found. Check back later for exciting new vacation spots!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="modern-destinations-section"
      style={{
        "--mouse-x": `${mousePosition.x}%`,
        "--mouse-y": `${mousePosition.y}%`,
      }}
    >
      <div className="animated-background"></div>
      <div className="floating-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <div className="modern-container">
        <div className="section-header glass-card">
          <h1 className="section-title gradient-text">
            Popular Travel Destinations
          </h1>
          <p className="section-subtitle">
            Discover the best vacation spots around the globe with TravelSansar
          </p>
        </div>
        <div className="destinations-grid">
          {displayedDestinations.map((destination, index) => (
            <article
              className="destination-card glass-card"
              key={destination.id}
              style={{ "--card-index": index }}
            >
              <div className="card-image-container">
                <div className="image-overlay"></div>
                <picture>
                  <img
                    src={destination.image || "/placeholder-image.jpg"}
                    alt={`Explore ${destination.name} - Top Travel Destination by TravelSansar`}
                    className="dg-card-image"
                    loading="lazy"
                    sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 33vw"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </picture>
                {isNewDestination(destination.createdAt) && (
                  <div className="new-badge">
                    <span>✨ New</span>
                  </div>
                )}
                <div className="card-hover-overlay">
                  <Link
                    to={`/destination/${destination.id}`}
                    className="quick-view-button glass-button"
                  >
                    Quick View
                  </Link>
                </div>
              </div>
              <div className="card-content">
                <h2 className="card-title">
                  <Link to={`/destination/${destination.id}`}>
                    {destination.name}
                  </Link>
                </h2>
                <p className="card-description">
                  {destination.description &&
                  destination.description.length > 80
                    ? `${destination.description.substring(0, 80)}...`
                    : destination.description ||
                      "Discover this amazing destination with TravelSansar."}
                </p>
                {destination.bestTimeToVisit && (
                  <div className="card-meta">
                    <div className="meta-item glass-tag">
                      <svg
                        className="meta-icon"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                      >
                        <path
                          fill="currentColor"
                          d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"
                        />
                      </svg>
                      <span>Best: {destination.bestTimeToVisit}</span>
                    </div>
                  </div>
                )}
                {/* <Link
                  to={`/destination/${destination.id}`}
                  className="explore-button glass-button primary"
                >
                  <span>Explore Destination</span>
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link> */}
              </div>
            </article>
          ))}
        </div>
        <div className="section-footer">
          <Link
            to="/destinations"
            className="view-all-button glass-button primary large"
          >
            <span>View All Travel Destinations</span>
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="currentColor"
              strokeWidth="2"
            >
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