import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCcVisa, FaCreditCard, FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  // SVG Icons for Nepali payment systems
  // const ESewaIcon = () => (
  //   <div className="ft-payment-logo esewa-logo" title="eSewa">
  //     <svg viewBox="0 0 100 40" className="ft-payment-svg">
  //       <rect width="100" height="40" rx="6" fill="#60c84c"/>
  //       <text x="50" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">eSewa</text>
  //     </svg>
  //   </div>
  // );

  // const KhaltiIcon = () => (
  //   <div className="ft-payment-logo khalti-logo" title="Khalti">
  //     <svg viewBox="0 0 100 40" className="ft-payment-svg">
  //       <rect width="100" height="40" rx="6" fill="#5c2d91"/>
  //       <text x="50" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Khalti</text>
  //     </svg>
  //   </div>
  // );

  // const IMEPayIcon = () => (
  //   <div className="ft-payment-logo imepay-logo" title="IME Pay">
  //     <svg viewBox="0 0 100 40" className="ft-payment-svg">
  //       <rect width="100" height="40" rx="6" fill="#ed1c24"/>
  //       <text x="50" y="22" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">IME</text>
  //       <text x="50" y="34" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Pay</text>
  //     </svg>
  //   </div>
  // );

  // const ConnectIPSIcon = () => (
  //   <div className="ft-payment-logo connectips-logo" title="ConnectIPS">
  //     <svg viewBox="0 0 100 40" className="ft-payment-svg">
  //       <rect width="100" height="40" rx="6" fill="#1e88e5"/>
  //       <text x="50" y="18" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Connect</text>
  //       <text x="50" y="30" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">IPS</text>
  //     </svg>
  //   </div>
  // );

  // const NepaliBank = ({ name, color }) => (
  //   <div className="ft-payment-logo" title={name}>
  //     <svg viewBox="0 0 100 40" className="ft-payment-svg">
  //       <rect width="100" height="40" rx="6" fill={color}/>
  //       <FaUniversity className="ft-bank-icon" />
  //       <text x="50" y="35" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{name}</text>
  //     </svg>
  //   </div>
  // );

  return (
    <footer className="ft-footer">
      <div className="ft-container">
        <div className="ft-footer-grid">
          <div className="ft-footer-column">
            <div className="ft-footer-logo">
              <span>Travel</span>Sansar
            </div>
            <p className="ft-footer-description">
              Creating unforgettable travel experiences for adventurers around the globe since 2010.
            </p>
            <div className="ft-social-links">
              <a href="/https://www.facebook.com/travelsansr" className="ft-social-link" aria-label="Follow us on Facebook">
                <FaFacebookF />
              </a>
              {/* <a href="/" className="ft-social-link" aria-label="Follow us on Twitter">
                <FaTwitter />
              </a> */}
              <a href="/https://www.instagram.com/travel_sansar/" className="ft-social-link" aria-label="Follow us on Instagram">
                <FaInstagram />
              </a>
              {/* <a href="/" className="ft-social-link" aria-label="Follow us on Pinterest">
                <FaPinterestP />
              </a> */}
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
              <h4 className="ft-payment-title">
                <FaCreditCard className="ft-payment-title-icon" />
                We Accept
              </h4>
              <div className="ft-payment-grid">
                {/* Nepali Payment Systems */}
                {/* <div className="ft-payment-group">
                  <span className="ft-payment-label">
                    <FaMobile className="ft-label-icon" />
                    Mobile Payments
                  </span>
                  <div className="ft-payment-icons">
                    <ESewaIcon />
                    <KhaltiIcon />
                    <IMEPayIcon />
                    <ConnectIPSIcon />
                  </div>
                </div> */}

                {/* Nepali Banks */}
                {/* <div className="ft-payment-group">
                  <span className="ft-payment-label">
                    <FaUniversity className="ft-label-icon" />
                    Local Banks
                  </span>
                  <div className="ft-payment-icons">
                    <NepaliBank name="Nepal Bank" color="#2c5aa0" />
                    <NepaliBank name="Rastriya Banijya" color="#cc0000" />
                    <NepaliBank name="Nabil Bank" color="#1e4d3e" />
                    <NepaliBank name="Standard Chartered" color="#007ec6" />
                  </div>
                </div> */}

                {/* International Cards */}
                <div className="ft-payment-group">
                  <span className="ft-payment-label">
                    <FaCreditCard className="ft-label-icon" />
                    International
                  </span>
                  <div className="ft-payment-icons">
                    <div className="ft-payment-logo visa-logo" title="Visa">
                      <FaCcVisa size={40} color="#1A1F71" />
                    </div>
                    {/* <div className="ft-payment-logo mastercard-logo" title="Mastercard">
                      <FaCcMastercard size={40} color="#EB001B" />
                    </div>
                    <div className="ft-payment-logo amex-logo" title="American Express">
                      <FaCcAmex size={40} color="#006FCF" />
                    </div>
                    <div className="ft-payment-logo paypal-logo" title="PayPal">
                      <FaPaypal size={40} color="#003087" />
                    </div> */}
                  </div>
                </div>
              </div>
              <p className="ft-payment-note">
                🔒 Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>

        <div className="ft-footer-bottom">
          <div className="ft-footer-bottom-content">
            <div className="ft-copyright-section">
              <p className="ft-copyright">© 2025 Travel Sansar. All Rights Reserved.</p>
              <div className="ft-developer-credit">
                <span>Designed & Developed with</span>
                <FaHeart className="ft-heart-icon" />
                <span>by</span>
                <a href="https://www.facebook.com/Chandan.Sharma.8689" target="_blank" rel="noopener noreferrer" className="ft-developer-link">
                  <FaFacebookF className="ft-dev-fb-icon" />
                  Chandan Sharma
                </a>
              </div>
            </div>
            <div className="ft-footer-bottom-links">
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms-of-service">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;