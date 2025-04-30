import React, { useState } from 'react';
import BookingForm from './BookingForm';
import LoginPopup from '../../Authentications/LoginPopup';

const DestinationCTA = ({ title, id }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Utility function to get a cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const handleOpenBooking = (e) => {
    e.preventDefault();
    // Check for the specific JWT cookie
    const token = getCookie('jwt_token_for_traveling_website_ChandanSharma');
    
    if (token) {
      // If cookie exists, show the booking form
      setShowBookingForm(true);
    } else {
      // If cookie does not exist, show the login popup
      setShowLoginPopup(true);
    }
  };

  const handleCloseBooking = () => {
    setShowBookingForm(false);
  };

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  return (
    <div className="destination-cta">
      <h2 className="cta-title">Ready to Explore {title}?</h2>
      <p className="cta-text">
        Join us for an unforgettable journey to this amazing destination. Our travel experts will help you plan the perfect trip!
      </p>
      <button 
        onClick={handleOpenBooking} 
        className="cta-button"
      >
        Book Your Trip
      </button>

      {showBookingForm && (
        <BookingForm 
          destination={title}
          destinationId={id}
          onClose={handleCloseBooking}
        />
      )}

      {showLoginPopup && (
        <LoginPopup 
          isOpen={showLoginPopup}
          onClose={handleCloseLoginPopup}
        />
      )}
    </div>
  );
};

export default DestinationCTA;