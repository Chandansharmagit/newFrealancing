import React from 'react';
import { IoLocationSharp, IoStar, IoTimeOutline } from 'react-icons/io5';

const DestinationHeader = ({ 
  title, 
  location, 
  rating = 0, 
  reviews = [], 
  bestTimeToVisit 
}) => {
  const reviewCount = Array.isArray(reviews) ? reviews.length : 0;
  
  return (
    <div className="destination-header">
      <h1 className="destination-title">{title}</h1>
      
      <div className="destination-location">
        <IoLocationSharp className="location-icon" size={18} />
        <span>{location}</span>
      </div>
      
      <div className="destination-meta">
        {rating > 0 && (
          <div className="meta-item">
            <IoStar className="meta-icon" size={18} />
            <span className="meta-text">
              <strong>{rating.toFixed(1)}</strong> 
              {reviewCount > 0 && ` (${reviewCount} reviews)`}
            </span>
          </div>
        )}
        
        {bestTimeToVisit && (
          <div className="meta-item">
            <IoTimeOutline className="meta-icon" size={18} />
            <span className="meta-text">
              Best time to visit: <strong>{bestTimeToVisit}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationHeader; 