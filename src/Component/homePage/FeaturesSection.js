import React from 'react';
import { FaWallet, FaHeadset, FaShieldAlt, FaHeart } from 'react-icons/fa';
import './FeaturesSection.css';

const 
FeaturesSection = () => {
  return (
    <section className="fs-features-section">
      <div className="fs-container">
        <div className="fs-section-header">
          <h2 className="fs-section-title">Why Choose Travel World</h2>
          <p className="fs-section-subtitle">Making your travel dreams a reality since 2010</p>
        </div>

        <div className="fs-features-grid">
          <div className="fs-feature-card">
            <div className="fs-feature-icon">
              <FaWallet />
            </div>
            <h3 className="fs-feature-title">Best Price Guarantee</h3>
            <p className="fs-feature-description">
              We promise the best rates and no hidden fees. Found a better price? We'll match it!
            </p>
          </div>

          <div className="fs-feature-card">
            <div className="fs-feature-icon">
              <FaHeadset />
            </div>
            <h3 className="fs-feature-title">24/7 Customer Support</h3>
            <p className="fs-feature-description">
              Our travel experts are available around the clock to assist you anytime, anywhere.
            </p>
          </div>

          <div className="fs-feature-card">
            <div className="fs-feature-icon">
              <FaShieldAlt />
            </div>
            <h3 className="fs-feature-title">100% Secure Booking</h3>
            <p className="fs-feature-description">
              Your personal and payment information is protected with advanced encryption.
            </p>
          </div>

          <div className="fs-feature-card">
            <div className="fs-feature-icon">
              <FaHeart />
            </div>
            <h3 className="fs-feature-title">Tailored Experiences</h3>
            <p className="fs-feature-description">
              Customized itineraries designed to match your preferences and travel style.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;