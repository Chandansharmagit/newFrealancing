import React, { useState } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [travelers, setTravelers] = useState('1 Adult');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality here
    console.log({
      destination: searchQuery,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      travelers
    });
  };

  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">Discover the World's Beauty</h1>
          <p className="hero-subtitle">Unforgettable journeys, extraordinary experiences, and personalized adventures await.</p>
          
          <div className="hero-cta">
            <a href="/destinations" className="btn-primary">Explore Destinations</a>
            <a href="/tours" className="btn-secondary">View Tours</a>
          </div>

          <form className="search-box" onSubmit={handleSearch}>
            <div className="search-input">
              <input 
                type="text" 
                placeholder="Where would you like to go?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Destination"
              />
              <button type="submit" className="search-btn">
                <i className="search-icon"></i>
                <span>Search</span>
              </button>
            </div>
            
            <div className="search-filters">
              <div className="filter">
                <label htmlFor="check-in">Check in</label>
                <input 
                  id="check-in"
                  type="date" 
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
              </div>
              <div className="filter">
                <label htmlFor="check-out">Check out</label>
                <input 
                  id="check-out"
                  type="date" 
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                />
              </div>
              <div className="filter">
                <label htmlFor="travelers">Travelers</label>
                <select 
                  id="travelers"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                >
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>2 Adults, 1 Child</option>
                  <option>2 Adults, 2 Children</option>
                  <option>More options</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;