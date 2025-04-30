// components/LoadingButton.jsx
import React from 'react';
import './LoadingButton.css';

const LoadingButton = ({ 
  type = "button", 
  loading, 
  loadingText, 
  text, 
  icon, 
  onClick 
}) => {
  return (
    <button
      type={type}
      className={`loading-button ${loading ? 'button-loading' : ''}`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="button-spinner"></span>
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {icon && <span className="button-icon">{icon}</span>}
          <span>{text}</span>
        </>
      )}
    </button>
  );
};

export default LoadingButton;