import React, { useState, useEffect, useRef } from 'react';
import './TeamSection.css';

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  useEffect(() => {
    fetchTeamMembers();
    
    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://backendtravelagencytwomicroservice.onrender.com/api/team');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeamMembers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load team members');
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(word => word[0]).join('').toUpperCase() : '?';
  };

  const handleCardInteraction = (cardId) => {
    setActiveCard(activeCard === cardId ? null : cardId);
  };

  if (loading) {
    return (
      <section className="team-section" ref={sectionRef}>
        <div className="team-container">
          <div className="loading-state">
            <div className="neural-loader">
              <div className="neural-circle"></div>
              <div className="neural-circle"></div>
              <div className="neural-circle"></div>
            </div>
            <div className="loading-text">
              <span>L</span><span>o</span><span>a</span><span>d</span><span>i</span><span>n</span><span>g</span>
              <span className="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="team-section" ref={sectionRef}>
        <div className="team-container">
          <div className="error-state">
            <div className="error-icon">⚠</div>
            <p className="error-message">{error}</p>
            <button onClick={fetchTeamMembers} className="retry-btn">
              <span className="btn-text">Retry</span>
              <span className="btn-icon">↻</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="team-section" ref={sectionRef}>
      <div 
        className="cursor-glow" 
        style={{
          left: mousePosition.x,
          top: mousePosition.y
        }}
      ></div>
      
      <div className="team-container">
        <div className="team-header">
          <div className="header-badge">Our Team</div>
          <h2 className="team-title">
            <span className="title-main">Meet the Visionaries</span>
            <span className="title-sub">Behind Your Journey</span>
          </h2>
          <p className="team-subtitle">
            Innovators, creators, and dream-weavers united by passion for extraordinary travel experiences
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div 
              key={member.id || index} 
              className={`team-card ${activeCard === (member.id || index) ? 'active' : ''}`}
              onClick={() => handleCardInteraction(member.id || index)}
              style={{ '--card-index': index }}
            >
              <div className="card-border"></div>
              <div className="card-content">
                <div className="member-avatar-container">
                  <div className="avatar-glow"></div>
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="avatar-image" />
                  ) : (
                    <div className="avatar-placeholder">
                      <span className="avatar-initials">{getInitials(member.name)}</span>
                      <div className="avatar-particles">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  )}
                  <div className="avatar-ring"></div>
                </div>
                
                <div className="member-info">
                  <h3 className="member-name">
                    <span className="name-text">{member.name}</span>
                    <div className="name-underline"></div>
                  </h3>
                  <p className="member-role">{member.position || member.role}</p>
                  
                  <div className="member-details">
                    {member.bio && (
                      <p className="member-bio">{member.bio}</p>
                    )}
                    
                    <div className="member-contact">
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="contact-item email">
                          <span className="contact-icon">✉</span>
                          <span className="contact-text">{member.email}</span>
                        </a>
                      )}
                      {member.phone && (
                        <div className="contact-item phone">
                          <span className="contact-icon">📞</span>
                          <span className="contact-text">{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="card-tech-grid">
                  <div className="tech-dot"></div>
                  <div className="tech-dot"></div>
                  <div className="tech-dot"></div>
                  <div className="tech-dot"></div>
                </div>
              </div>
              
              <div className="card-hologram"></div>
            </div>
          ))}
        </div>

        {teamMembers.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <p>No team members available</p>
          </div>
        )}
      </div>
      
      <div className="section-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
    </section>
  );
};

export default TeamSection;