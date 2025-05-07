import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="ft-footer">
      <div className="ft-container">
        <div className="ft-footer-grid">
          <div className="ft-footer-column">
            <div className="ft-footer-logo">
              <span>Travel</span>World
            </div>
            <p className="ft-footer-description">
              Creating unforgettable travel experiences for adventurers around the globe since 2010.
            </p>
            <div className="ft-social-links">
              <a href="/" className="ft-social-link" aria-label="Follow us on Facebook">
                <FaFacebookF />
              </a>
              <a href="/" className="ft-social-link" aria-label="Follow us on Twitter">
                <FaTwitter />
              </a>
              <a href="/" className="ft-social-link" aria-label="Follow us on Instagram">
                <FaInstagram />
              </a>
              <a href="/" className="ft-social-link" aria-label="Follow us on Pinterest">
                <FaPinterestP />
              </a>
            </div>
          </div>

          <div className="ft-footer-column">
            <h3 className="ft-column-title">Quick Links</h3>
            <ul className="ft-footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/destinations">Destinations</a></li>
              <li><a href="/tours">Tours</a></li>
              <li><a href="/blog">Travel Blog</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="ft-footer-column">
            <h3 className="ft-column-title">Destinations</h3>
            <ul className="ft-footer-links">
              <li><a href="/destinations/europe">Europe</a></li>
              <li><a href="/destinations/asia">Asia</a></li>
              <li><a href="/destinations/africa">Africa</a></li>
              <li><a href="/destinations/north-america">North America</a></li>
              <li><a href="/destinations/south-america">South America</a></li>
              <li><a href="/destinations/australia">Australia & Oceania</a></li>
            </ul>
          </div>

          <div className="ft-footer-column">
            <h3 className="ft-column-title">Contact Info</h3>
            <ul className="ft-contact-info">
              <li>
                <FaMapMarkerAlt className="ft-contact-icon" /> Sahidchowk,Narayanghat,Chitwan
              </li>
              <li>
                <FaPhone className="ft-contact-icon" /> +9779855051795
              </li>
              <li>
                <FaEnvelope className="ft-contact-icon" /> info@travelsansr.com
              </li>
            </ul>
            <div className="ft-payment-methods">
              <img
                src="https://via.placeholder.com/200x30"
                alt="Accepted payment methods"
                className="ft-payment-image"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="ft-footer-bottom">
          <p className="ft-copyright">© 2025 Travel World. All Rights Reserved.</p>
          <div className="ft-footer-bottom-links">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;