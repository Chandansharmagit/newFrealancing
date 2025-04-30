// components/Notification.jsx
import React from 'react';
import './Notification.css';

const Notification = ({ show, message, type }) => {
  if (!show) return null;
  
  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-content">
        <span className="notification-message">{message}</span>
      </div>
    </div>
  );
};

export default Notification;