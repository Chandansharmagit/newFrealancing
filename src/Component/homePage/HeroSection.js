import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Zap, Globe, Rocket, Star, Search, Calendar, Filter, ArrowRight, MapPin } from 'lucide-react';
import './HeroSection.css';

const HeroSection = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [adventureType, setAdventureType] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const canvasRef = React.useRef(null);
  const particlesRef = React.useRef([]);
  const animationFrameRef = React.useRef(null);
  const navigate = useNavigate();

  // Initialize particles and animations
  useEffect(() => {
    setIsLoaded(true);

    // Mouse tracking for parallax effects
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    // Handle window resize
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    // Initialize particle system
    const initParticles = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Create particles
      particlesRef.current = [];
      for (let i = 0; i < 150; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          size: Math.random() * 4 + 1,
          color: i % 2 ? '#1E3A8A' : '#F59E0B',
          life: Math.random()
        });
      }

      const animate = () => {
        if (!canvas) return;
        ctx.fillStyle = 'rgba(243, 244, 246, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particlesRef.current.forEach((particle) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life += 0.005;

          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 12
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        });

        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    initParticles();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      destination: searchQuery,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adventureType,
      budgetRange,
      groupSize,
    }).toString();
    navigate(`/search?${queryParams}`);
  };

  return (
    <div className={`ts-hero-container ${isLoaded ? 'ts-loaded' : ''}`}>
      {/* Animated Canvas Background */}
      <canvas 
        ref={canvasRef}
        className="ts-canvas-background"
      />
      
      {/* Dynamic Gradient Orbs */}
      <div className="ts-gradient-orbs">
        <div 
          className="ts-orb ts-orb-1"
          style={{
            transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
          }}
        />
        <div 
          className="ts-orb ts-orb-2"
          style={{
            transform: `translate(${mousePos.x * -20}px, ${mousePos.y * 20}px)`,
          }}
        />
        <div 
          className="ts-orb ts-orb-3"
          style={{
            transform: `translate(${mousePos.x * 15}px, ${mousePos.y * -25}px)`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="ts-main-content">
        {/* Epic Badge */}
        <div className="ts-epic-badge">
          <div className="ts-badge-content">
            <Rocket className="ts-badge-icon ts-rocket" />
            <span className="ts-badge-text">
              LIMITLESS ADVENTURES
            </span>
            <Star className="ts-badge-icon ts-star" />
          </div>
        </div>

        {/* Mind-Blowing Title */}
        <div className="ts-title-section">
          <h1 className="ts-main-title">
            <div className="ts-title-wrapper">
              <span 
                className="ts-title-shadow"
                style={{ transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)` }}
              >
                EPIC
              </span>
              <span className="ts-main-title">
                EPIC
              </span>
            </div>
          </h1>
          <h2 className="ts-subtitle">
            ADVENTURES
          </h2>
        </div>

        {/* Dynamic Subtitle */}
        <p className="ts-description">
          Unleash your inner explorer and dive into 
          <span className="ts-highlight-text"> extraordinary experiences </span>
          that will blow your mind and create memories that last forever!
        </p>

        {/* Epic Action Buttons */}
        <div className="ts-action-buttons">
          <button 
            className="ts-btn ts-btn-explore"
            onClick={() => navigate('/destinations')}
          >
            <div className="ts-btn-content">
              <Globe className="ts-btn-icon ts-globe" />
              <span>Our Destinations</span>
              <ArrowRight className="ts-btn-icon ts-arrow" />
            </div>
          </button>
          
          <button 
            className="ts-btn ts-btn-discover"
            onClick={() => navigate('/tours')}
          >
            <div className="ts-btn-content">
              <Zap className="ts-btn-icon ts-zap" />
              <span>Book Tours</span>
              <Star className="ts-btn-icon ts-star-btn" />
            </div>
          </button>
        </div>

        {/* Futuristic Search Interface */}
        <div className="ts-search-interface">
          <div className="ts-search-container">
            {/* Search Grid */}
            <form onSubmit={handleSearch}>
              <div className="ts-search-grid">
                {/* Destination Input */}
                <div className="ts-input-group ts-destination">
                  <label className="ts-input-label">
                    <MapPin className="ts-label-icon" />
                    Destination
                  </label>
                  <div className="ts-input-wrapper">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Where do you want to go?"
                      className="ts-search-input"
                    />
                  </div>
                </div>

                {/* Date Inputs */}
                <div className="ts-input-group">
                  <label className="ts-input-label">
                    <Calendar className="ts-label-icon" />
                    Check In
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="ts-search-input ts-date-input"
                  />
                </div>

                <div className="ts-input-group">
                  <label className="ts-input-label">
                    <Calendar className="ts-label-icon" />
                    Check Out
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="ts-search-input ts-date-input"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="ts-search-actions">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`ts-filter-btn ${showFilters ? 'ts-active' : ''}`}
                >
                  <Filter className="ts-filter-icon" />
                  FILTERS
                </button>
                
                <button
                  type="submit"
                  className="ts-search-btn"
                >
                  <div className="ts-search-btn-content">
                    <Search className="ts-search-icon" />
                    <span>SEARCH ADVENTURES</span>
                  </div>
                </button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="ts-filters-panel">
                  <h3 className="ts-filters-title">Advanced Filters</h3>
                  <div className="ts-filters-grid">
                    <div className="ts-filter-group">
                      <label className="ts-filter-label">Adventure Type</label>
                      <select 
                        className="ts-filter-select" 
                        value={adventureType}
                        onChange={(e) => setAdventureType(e.target.value)}
                      >
                        <option value="">All Types</option>
                        <option value="extreme">Extreme Sports</option>
                        <option value="nature">Nature & Wildlife</option>
                        <option value="culture">Cultural Experiences</option>
                      </select>
                    </div>
                    <div className="ts-filter-group">
                      <label className="ts-filter-label">Budget Range</label>
                      <select 
                        className="ts-filter-select" 
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                      >
                        <option value="">Any Budget</option>
                        <option value="low">$0 - $500</option>
                        <option value="mid">$500 - $2000</option>
                        <option value="high">$2000+</option>
                      </select>
                    </div>
                    <div className="ts-filter-group">
                      <label className="ts-filter-label">Group Size</label>
                      <select 
                        className="ts-filter-select" 
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
        <div className="ts-scroll-indicator">
          <ChevronDown className="ts-scroll-icon" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;