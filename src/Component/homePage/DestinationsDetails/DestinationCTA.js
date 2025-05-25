import React, { useState, useCallback } from 'react';
import BookingForm from './BookingForm';

import LoginPage from '../../Authentications/Login';

const DestinationCTA = ({ title, id }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("https://authenticationagency.onrender.com/api/check-auth", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      console.log("Auth check response:", data);
      return data.isAuthenticated;
    } catch (error) {
      console.error("Error checking auth:", error.message);
      return false;
    }
  }, []);

  const handleOpenBooking = async (e) => {
    e.preventDefault();
    const isAuth = await checkAuth();
    
    if (isAuth) {
      setShowBookingForm(true);
      setShowLoginPopup(false);
    } else {
      setShowLoginPopup(true);
      setShowBookingForm(false);
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
        <LoginPage 
          isOpen={showLoginPopup}
          onClose={handleCloseLoginPopup}
          onLoginSuccess={() => {
            setShowLoginPopup(false);
            setShowBookingForm(true);
            checkAuth();
          }}
        />
      )}
    </div>
  );
};

export default DestinationCTA;