import React, { useState } from "react";
import "./TopHeader.css";

const TopHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  const closeHeader = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="trvl-top-header">
      <div className="trvl-top-header__container">
        <div className="trvl-top-header__content">
          <div className="trvl-top-header__info">
            <div className="trvl-top-header__info-item">
              <i className="trvl-icon trvl-icon--phone"></i>
              <span>+977 9801234567</span>
            </div>
            <div className="trvl-top-header__info-item">
              <i className="trvl-icon trvl-icon--email"></i>
              <span>info@travelsansar.com</span>
            </div>
          </div>
          
          <div className="trvl-top-header__announcement">
            <i className="trvl-icon trvl-icon--megaphone"></i>
            <span>Special Offer: 20% off on all Everest Base Camp treks booked this month!</span>
          </div>
          
          <div className="trvl-top-header__actions">
            <div className="trvl-social">
              <a href="https://facebook.com" className="trvl-social__icon" aria-label="Facebook">
                <i className="trvl-icon trvl-icon--facebook"></i>
              </a>
              <a href="https://instagram.com" className="trvl-social__icon" aria-label="Instagram">
                <i className="trvl-icon trvl-icon--instagram"></i>
              </a>
              <a href="https://twitter.com" className="trvl-social__icon" aria-label="Twitter">
                <i className="trvl-icon trvl-icon--twitter"></i>
              </a>
            </div>
            <select className="trvl-language-selector">
              <option value="en">English</option>
              <option value="ne">नेपाली</option>
              <option value="hi">हिन्दी</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>
        
        <button className="trvl-top-header__close" onClick={closeHeader} aria-label="Close top header">
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  );
};

export default TopHeader;