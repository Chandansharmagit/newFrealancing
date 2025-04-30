import React from 'react';
import './NewsletterSection.css';

const NewsletterSection = () => {
  return (
    <section className="ns-newsletter-section">
      <div className="ns-background-split">
        <div className="ns-white-half"></div>
        <div 
          className="ns-image-half"
          style={{
            backgroundImage: `url('https://img.freepik.com/free-vector/colorful-abstract-background_23-2148466263.jpg')`,
          }}
        ></div>
      </div>
      <div className="ns-container">
        <div className="ns-newsletter-content">
          <h2 className="ns-section-title">Unlock Your Next Adventure</h2>
          <p className="ns-section-subtitle">
            Subscribe to our newsletter for exclusive travel deals, insider tips, and vibrant destination guides.
          </p>
          <div className="ns-newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="ns-email-input"
              required
              aria-label="Email address for newsletter subscription"
            />
            <button type="button" className="ns-btn-subscribe">
              Join Now
            </button>
          </div>
          <p className="ns-attribution">
            Image by <a href="https://www.freepik.com">Freepik</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;