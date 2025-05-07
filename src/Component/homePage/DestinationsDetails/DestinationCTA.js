import React, { useState, useCallback } from 'react';
import BookingForm from './BookingForm';
import LoginPopup from '../../Authentications/LoginPopup';

const DestinationCTA = ({ title, id }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("https://authenticationagency.onrender.com/api/check-auth", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      console.log("Auth check response:", data);
      setIsAuthenticated(data.isAuthenticated);
      return data.isAuthenticated;
    } catch (error) {
      console.error("Error checking auth:", error.message);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  const handleOpenBooking = async (e) => {
    e.preventDefault();
    const isAuth = await checkAuth();
    
    if (isAuth) {
      // If authenticated, show the booking form
      setShowBookingForm(true);
      setShowLoginPopup(false);
    } else {
      // If not authenticated, show the login popup
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
        <LoginPopup 
          isOpen={showLoginPopup}
          onClose={handleCloseLoginPopup}
          onLoginSuccess={() => {
            setIsAuthenticated(true);
            setShowLoginPopup(false);
            setShowBookingForm(true);
            checkAuth(); // Re-check auth after login
          }}
        />
      )}
    </div>
  );
};

export default DestinationCTA;