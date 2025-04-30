import React from 'react';
import './StatsSection.css';

const StatsSection = () => {
  return (
    <section className="ss-stats-section">
      <div className="ss-container">
        <div className="ss-stats-container">
          <div className="ss-stat-item">
            <h3 className="ss-stat-value">2M+</h3>
            <p className="ss-stat-label">Happy Travelers</p>
          </div>
          <div className="ss-stat-item">
            <h3 className="ss-stat-value">100+</h3>
            <p className="ss-stat-label">Countries</p>
          </div>
          <div className="ss-stat-item">
            <h3 className="ss-stat-value">5000+</h3>
            <p className="ss-stat-label">Tours Completed</p>
          </div>
          <div className="ss-stat-item">
            <h3 className="ss-stat-value">4.9</h3>
            <p className="ss-stat-label">Average Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;