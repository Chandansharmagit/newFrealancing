import React, { useState } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [travelers, setTravelers] = useState('1 Adult');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

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

  const toggleFilters = () => {
    setIsFiltersExpanded(!isFiltersExpanded);
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Discover the World's Beauty</h1>
          <p className="hero-subtitle">Unforgettable journeys, extraordinary experiences, and personalized adventures await.</p>
          
          <div className="hero-cta">
            <a href="/destinations" className="btn btn-primary">
              <span>Explore Destinations</span>
            </a>
            <a href="/tours" className="btn btn-secondary">
              <span>View Tours</span>
            </a>
          </div>

          <form className="search-box" onSubmit={handleSearch}>
            <div className="search-main">
              <div className="search-input-container">
                {/* <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg> */}
                <input 
                  type="text" 
                  placeholder="Where would you like to go?" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Destination"
                  className="search-input"
                />
              </div>
              
              <button type="button" className="filter-toggle" onClick={toggleFilters} aria-expanded={isFiltersExpanded}>
                <svg className="filter-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14"/>
                  <line x1="4" y1="10" x2="4" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12" y2="3"/>
                  <line x1="20" y1="21" x2="20" y2="16"/>
                  <line x1="20" y1="12" x2="20" y2="3"/>
                  <line x1="1" y1="14" x2="7" y2="14"/>
                  <line x1="9" y1="8" x2="15" y2="8"/>
                  <line x1="17" y1="16" x2="23" y2="16"/>
                </svg>
                <span className="filter-text">Filters</span>
              </button>
              
              <button type="submit" className="search-btn">
                <span>Search</span>
              </button>
            </div>
            
            <div className={`search-filters ${isFiltersExpanded ? 'expanded' : ''}`}>
              <div className="filter-group">
                <div className="filter date-filter">
                  <label htmlFor="check-in">Check in</label>
                  <input 
                    id="check-in"
                    type="date" 
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                  />
                </div>
                <div className="filter date-filter">
                  <label htmlFor="check-out">Check out</label>
                  <input 
                    id="check-out"
                    type="date" 
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                  />
                </div>
                <div className="filter select-filter">
                  <label htmlFor="travelers">Travelers</label>
                  <div className="select-wrapper">
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;