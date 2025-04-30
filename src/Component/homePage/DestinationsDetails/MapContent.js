import React from 'react';
import { IoNavigate, IoInformationCircle } from 'react-icons/io5';

const MapContent = ({ destination }) => {
  const { latitude, longitude, location } = destination;
  const hasCoordinates = latitude && longitude;
  const mapUrl = hasCoordinates 
    ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed` 
    : `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
  
  return (
    <div className="map-content" id="map-panel" role="tabpanel" aria-labelledby="map-tab">
      <h2 className="content-title">Location</h2>
      
      <div className="map-container">
        <iframe
          src={mapUrl}
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map showing location of ${destination.title}`}
        ></iframe>
      </div>
      
      <div className="location-details">
        <div className="location-address">
          <h3 className="section-subtitle">Address</h3>
          <p>{destination.location}</p>
          
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${hasCoordinates ? `${latitude},${longitude}` : encodeURIComponent(location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="directions-link"
          >
            <IoNavigate size={16} />
            <span>Get Directions</span>
          </a>
        </div>
        
        {destination.locationInfo && (
          <div className="location-info">
            <h3 className="section-subtitle">Location Information</h3>
            <div className="info-note">
              <IoInformationCircle size={18} className="info-icon" />
              <p>{destination.locationInfo}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapContent; 