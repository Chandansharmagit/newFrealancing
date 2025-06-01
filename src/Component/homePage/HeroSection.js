import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Zap, Globe, Rocket, Star, Search, Calendar, Filter, ArrowRight, MapPin } from 'lucide-react';
import './HeroSection.css';

const HeroSection = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [adventureType, setAdventureType] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const navigate = useNavigate();

  // Initialize particles and animations
  useEffect(() => {
    setIsLoaded(true);
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Mouse tracking for parallax effects
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    // Initialize particle system
    const initParticles = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Create particles
      for (let i = 0; i < 100; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3,
          hue: Math.random() * 360,
          life: Math.random()
        });
      }

      const animate = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particlesRef.current.forEach((particle, index) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life += 0.01;

          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 10
          );
          gradient.addColorStop(0, `hsla(${particle.hue + particle.life * 50}, 100%, 50%, 0.8)`);
          gradient.addColorStop(1, `hsla(${particle.hue + particle.life * 50}, 100%, 50%, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        });

        requestAnimationFrame(animate);
      };
      animate();
    };

    window.addEventListener('mousemove', handleMouseMove);
    initParticles();

    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      destination: searchQuery,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adventureType: adventureType,
      budgetRange: budgetRange,
      groupSize: groupSize,
    }).toString();
    navigate(`/search?${queryParams}`);
  };

  return (
    <div className={`hero-container ${isLoaded ? 'loaded' : ''}`}>
      {/* Animated Canvas Background */}
      <canvas 
        ref={canvasRef}
        className="canvas-background"
      />
      
      {/* Dynamic Gradient Orbs */}
      <div className="gradient-orbs">
        <div 
          className="orb orb-1"
          style={{
            transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
          }}
        />
        <div 
          className="orb orb-2"
          style={{
            transform: `translate(${mousePos.x * -20}px, ${mousePos.y * 20}px)`,
          }}
        />
        <div 
          className="orb orb-3"
          style={{
            transform: `translate(${mousePos.x * 15}px, ${mousePos.y * -25}px)`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="main-content">
        
        {/* Floating Status Bar */}
        <div className="status-bar">
          <div className="status-item online">
            <div className="status-dot"></div>
            <span>ONLINE</span>
          </div>
          <div className="status-item time">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>

        {/* Epic Badge */}
        <div 
          className="epic-badge"
          onMouseEnter={() => setHoveredElement('badge')}
          onMouseLeave={() => setHoveredElement(null)}
        >
          <div className="badge-glow"></div>
          <div className="badge-content">
            <Rocket className="badge-icon rocket" />
            <span className="badge-text">
              LIMITLESS ADVENTURES
            </span>
            <Star className="badge-icon star" />
          </div>
        </div>

        {/* Mind-Blowing Title */}
        <div className="title-section">
          <h1 className="main-title">
            <div className="title-wrapper">
              <span 
                className="title-shadow"
                style={{ transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)` }}
              >
                EPIC
              </span>
              <span className="main-title">
                EPIC
              </span>
            </div>
          </h1>
          <h2 className="subtitle">
            ADVENTURES
          </h2>
          <div className="title-glow"></div>
        </div>

        {/* Dynamic Subtitle */}
        <p className="description">
          Unleash your inner explorer and dive into 
          <span className="highlight-text"> extraordinary experiences </span>
          that will blow your mind and create memories that last forever!
        </p>

        {/* Epic Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn btn-explore"
            onClick={() => navigate('/destinations')}
            onMouseEnter={() => setHoveredElement('explore')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <div className="btn-glow"></div>
            <div className="btn-content">
              <Globe className="btn-icon globe" />
              <span>Our Destinations</span>
              <ArrowRight className="btn-icon arrow" />
            </div>
          </button>
          
          <button 
            className="btn btn-discover"
            onClick={() => navigate('/tours')}
            onMouseEnter={() => setHoveredElement('discover')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <div className="btn-glow"></div>
            <div className="btn-content">
              <Zap className="btn-icon zap" />
              <span>Book Tours</span>
              <Star className="btn-icon star-btn" />
            </div>
          </button>
        </div>

        {/* Futuristic Search Interface */}
        <div className="search-interface">
          <div className="search-container">
            <div className="search-glow"></div>
            
            {/* Search Grid */}
            <form onSubmit={handleSearch}>
              <div className="search-grid">
                {/* Destination Input */}
                <div className="input-group destination">
                  <label className="input-label cyan">
                    <MapPin className="label-icon" />
                    Destination
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Where do you want to go?"
                      className="search-input"
                    />
                    <div className="input-hover-effect"></div>
                  </div>
                </div>

                {/* Date Inputs */}
                <div className="input-group">
                  <label className="input-label purple">
                    <Calendar className="label-icon" />
                    Check In
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="search-input date-input"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label pink">
                    <Calendar className="label-icon" />
                    Check Out
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="search-input date-input"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="search-actions">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`filter-btn ${showFilters ? 'active' : ''}`}
                >
                  <Filter className="filter-icon" />
                  FILTERS
                </button>
                
                <button
                  type="submit"
                  className="search-btn"
                >
                  <div className="search-btn-glow"></div>
                  <div className="search-btn-content">
                    <Search className="search-icon" />
                    <span>SEARCH ADVENTURES</span>
                    <div className="search-pulse"></div>
                  </div>
                </button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="filters-panel">
                  <h3 className="filters-title">Advanced Filters</h3>
                  <div className="filters-grid">
                    <div className="filter-group">
                      <label className="filter-label">Adventure Type</label>
                      <select 
                        className="filter-select" 
                        value={adventureType}
                        onChange={(e) => setAdventureType(e.target.value)}
                      >
                        <option value="">All Types</option>
                        <option value="extreme">Extreme Sports</option>
                        <option value="nature">Nature & Wildlife</option>
                        <option value="culture">Cultural Experiences</option>
                      </select>
                    </div>
                    <div className="filter-group">
                      <label className="filter-label">Budget Range</label>
                      <select 
                        className="filter-select" 
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                      >
                        <option value="">Any Budget</option>
                        <option value="low">$0 - $500</option>
                        <option value="mid">$500 - $2000</option>
                        <option value="high">$2000+</option>
                      </select>
                    </div>
                    <div className="filter-group">
                      <label className="filter-label">Group Size</label>
                      <select 
                        className="filter-select" 
                        value={groupSize}
                        onChange={(e) => setGroupSize(e.target.value)}
                      >
                        <option value="">Any Size</option>
                        <option value="solo">Solo Traveler</option>
                        <option value="couple">Couple</option>
                        <option value="group">Group (3+)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <ChevronDown className="scroll-icon" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;