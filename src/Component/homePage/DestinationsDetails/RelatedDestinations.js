import React from 'react';
import { Link } from 'react-router-dom';
import { IoArrowForward } from 'react-icons/io5';

const RelatedDestinations = ({ relatedDestinations }) => {
  if (!relatedDestinations || relatedDestinations.length === 0) {
    return null;
  }
  
  // Helper function to get full image URL
  const getFullImageUrl = (url) => {
    if (!url) return '';
    // Check if URL already has http:// or https:// prefix
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Otherwise, prepend the base URL
    return `http://localhost:5000/upload/image${url}`;
  };

  return (
    <div className="related-destinations">
      <h2 className="section-title">You Might Also Like</h2>
      
      <div className="destinations-grid">
        {relatedDestinations.map((destination, index) => (
          <Link 
            to={`/destinations/${destination._id || destination.id}`}
            className="destination-card"
            key={destination._id || destination.id || index}
          >
            <div className="destination-image">
              <img 
                src={getFullImageUrl(destination.thumbnail || (destination.images && destination.images[0]?.url))} 
                alt={destination.title} 
                loading="lazy"
              />
            </div>
            <div className="destination-info">
              <h3 className="destination-name">{destination.title}</h3>
              <p className="destination-location">{destination.location}</p>
              
              <div className="destination-footer">
                {destination.rating && (
                  <div className="destination-rating">
                    <span className="rating-value">{destination.rating.toFixed(1)}</span>
                    <span className="rating-label">{getRatingLabel(destination.rating)}</span>
                  </div>
                )}
                <span className="view-more">
                  View <IoArrowForward size={14} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Helper function to get rating label
const getRatingLabel = (rating) => {
  if (rating >= 9) return 'Exceptional';
  if (rating >= 8) return 'Excellent';
  if (rating >= 7) return 'Very Good';
  if (rating >= 6) return 'Good';
  return 'Average';
};

export default RelatedDestinations; 