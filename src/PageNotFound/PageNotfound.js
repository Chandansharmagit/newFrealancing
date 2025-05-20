import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const goToHome = () => {
    navigate('/');
  };

  const goBack = () => {
    navigate(-1);
  };

  // Animation for the plane
  const [planePosition, setPlanePosition] = useState(0);
  useEffect(() => {
    const animatePlane = () => {
      setPlanePosition((prev) => (prev + 1) % 100);
    };
    const animation = setInterval(animatePlane, 50);
    return () => clearInterval(animation);
  }, []);

  return (
    <div className="not-found-container">
      <div className="sky">
        <div className="stars"></div>
        <div className="airplane" style={{ left: `${planePosition}%` }}>
          <span role="img" aria-label="airplane">✈️</span>
        </div>
        <div className="clouds"></div>
      </div>
      
      <div className="content-container">
        <h1 className="error-code">404</h1>
        <div className="compass">
          <div className="compass-inner"></div>
          <div className="needle"></div>
        </div>
        <h2 className="error-message">Destination Not Found</h2>
        <p className="error-description">
          Looks like you've wandered off the map! The destination you're looking for doesn't exist or has been moved.
        </p>
        <div className="suggestions">
          <p>You might want to check:</p>
          <ul>
            <li>If the URL was typed correctly</li>
            <li>If this page has been moved to a new location</li>
            <li>If you have the right travel coordinates</li>
          </ul>
        </div>
        <p className="redirect-message">
          You'll be redirected to the homepage in <span className="countdown">{countdown}</span> seconds
        </p>
        <div className="button-container">
          <button onClick={goToHome} className="home-button">
            Take Me Home
          </button>
          <button onClick={goBack} className="back-button">
            Go Back
          </button>
        </div>
      </div>
      
      <div className="landmark-silhouettes">
        <div className="landmark eiffel"></div>
        <div className="landmark pyramid"></div>
        <div className="landmark taj-mahal"></div>
        <div className="landmark statue-liberty"></div>
      </div>
    </div>
  );
};

export default NotFound;