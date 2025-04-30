import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieBanner.css';
import Cookies from 'js-cookie';


const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);

  useEffect(() => {
    const token = Cookies.get('jwt_token_for_traveling_website_ChandanSharma');
    const cookieChoiceMade = localStorage.getItem('cookieConsentChoice');

    if (token) {
      console.log('JWT Token from cookie:', token);
      localStorage.setItem("jwt",token);
      setJwtToken(token);

   
    }




    if (!cookieChoiceMade) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);
  console.log(jwtToken)

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      personalization: true
    };

    localStorage.setItem('cookiePreferences', JSON.stringify(allPreferences));
    localStorage.setItem('cookieConsentChoice', 'accepted');
    setShowBanner(false);

    console.log('Cookies accepted, initializing tracking...');
  };

  const handleAcceptNecessary = () => {
    const minimalPreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      personalization: false
    };

    localStorage.setItem('cookiePreferences', JSON.stringify(minimalPreferences));
    localStorage.setItem('cookieConsentChoice', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <div className="cookie-banner-icon"></div>
        <div className="cookie-banner-text">
          <h3>We Value Your Privacy</h3>
          <p>
            We use cookies to enhance your browsing experience, analyze site traffic, 
            and personalize content. By clicking "Accept All," you consent to our use of 
            cookies as described in our <Link to="/cookie-policy">Cookie Policy</Link>.
          </p>
        </div>
        <div className="cookie-banner-actions">
          <Link to="/cookie-policy" className="cookie-btn text">
            Cookie Settings
          </Link>
          <button 
            className="cookie-btn secondary"
            onClick={handleAcceptNecessary}
          >
            Accept Necessary
          </button>
          <button 
            className="cookie-btn primary"
            onClick={handleAcceptAll}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
