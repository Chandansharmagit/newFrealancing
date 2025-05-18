import React, { useEffect, useMemo, useState } from 'react';

import axios from 'axios';
import { setMetaTags } from '../homePage/ViewallDestinations/Utils/setMetaTags';
import './AboutUs.css';

const AboutUs = () => {
  // State for team members and error handling
  const [teamMembers, setTeamMembers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Structured Data for Organization (JSON-LD)
  const structuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TravelSansar',
    url: 'https://travelsansar.com',
    logo: 'https://travelsansar.com/logo.png',
    description: 'TravelSansar crafts unforgettable travel experiences with handpicked tours and personalized itineraries.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-123-4567',
      contactType: 'Customer Service',
      email: 'support@travelsansar.com',
    },
    sameAs: [
      'https://www.facebook.com/travelsansar',
      'https://www.instagram.com/travelsansar',
      'https://www.twitter.com/travelsansar',
    ],
  }), []);

  // Set Meta Tags and Structured Data
  useEffect(() => {
    const metaConfig = {
      title: 'About Us - TravelSansar',
      description: 'Learn about TravelSansar, our mission to create unforgettable travel experiences, and meet our passionate team.',
      keywords: 'about TravelSansar, travel agency, our story, mission, team, travel experiences',
      robots: 'index, follow',
      canonical: 'https://travelsansar.com/AboutUs-page',
      structuredData,
    };

    const cleanup = setMetaTags(metaConfig);
    return cleanup;
  }, [structuredData]);

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://backendtravelagencytwomicroservice.onrender.com/api/team');
        setTeamMembers(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError('Failed to load team members. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);

  // Loading skeleton component
  const TeamCardSkeleton = () => (
    <div className="team-card skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-subtitle"></div>
        <div className="skeleton-line skeleton-text"></div>
        <div className="skeleton-line skeleton-text short"></div>
      </div>
    </div>
  );

  return (
    <main className="about-us">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-text-wrapper">
              <span className="hero-badge">EST. 2010</span>
              <h1 className="hero-title">
                About <span className="highlight">TravelSansar</span>
              </h1>
              <p className="hero-subtitle">
                Crafting Unforgettable Journeys Around the World
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Happy Travelers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Destinations</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">15+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="story section-padding">
        <div className="container">
          <div className="story-wrapper">
            <div className="story-content">
              <div className="section-header">
                <span className="section-tag">Our Journey</span>
                <h2 className="section-title-head">The Story Behind TravelSansar</h2>
              </div>
              <div className="story-text">
                <p className="paragraph-large">
                  Founded in 2010, TravelSansar began with a simple yet powerful vision: 
                  to share the world's beauty through authentic, meaningful travel experiences.
                </p>
                <p>
                  What started as a small local tour operator has grown into a globally 
                  recognized travel agency. We specialize in curating personalized itineraries 
                  that blend cultural immersion, adventure, and comfort.
                </p>
                <p>
                  Every journey we craft tells a story. Whether you're exploring ancient 
                  ruins, relaxing on pristine beaches, or discovering hidden local gems, 
                  we're here to transform your travel dreams into unforgettable memories.
                </p>
              </div>
              <div className="story-features">
                <div className="feature-item">
                  <div className="feature-icon">🌍</div>
                  <span>Global Reach</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✨</div>
                  <span>Personalized Experiences</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🏆</div>
                  <span>Award-Winning Service</span>
                </div>
              </div>
            </div>
            <div className="story-visual">
              <div className="image-container">
                <img
                  src="https://clipart-library.com/img1/1101314.jpg"
                  alt="TravelSansar team planning a tour"
                  className="story-image"
                  loading="lazy"
                />
                <div className="image-decoration"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision section-padding">
        <div className="container">
          <div className="section-header centered">
            <span className="section-tag">Our Purpose</span>
            <h2 className="section-title">Mission & Vision</h2>
          </div>
          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="card-icon">
                <div className="icon-wrapper mission-icon">
                  <span>🎯</span>
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">Our Mission</h3>
                <p className="card-text">
                  To inspire and empower travelers to explore the world with curiosity, 
                  creating meaningful experiences that connect people, cultures, and 
                  create lasting memories.
                </p>
              </div>
            </div>
            <div className="vision-card">
              <div className="card-icon">
                <div className="icon-wrapper vision-icon">
                  <span>🚀</span>
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">Our Vision</h3>
                <p className="card-text">
                  To be the world's leading travel agency that transforms journeys 
                  into stories, fostering a global community of explorers and 
                  culture enthusiasts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team section-padding">
        <div className="container">
          <div className="section-header centered">
            <span className="section-tag">Our People</span>
            <h2 className="section-title">Meet Our Expert Team</h2>
            <p className="section-description">
              Our passionate travel experts are dedicated to making every journey 
              extraordinary and every moment unforgettable.
            </p>
          </div>
          
          {error && (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <p className="error-message">{error}</p>
            </div>
          )}
          
          <div className="team-grid">
            {isLoading ? (
              // Show skeleton loading
              Array(4).fill(0).map((_, index) => (
                <TeamCardSkeleton key={index} />
              ))
            ) : teamMembers.length > 0 ? (
              teamMembers.map((member, index) => (
                <article key={member._id} className="team-card">
                  <div className="team-card-inner">
                    <div className="team-image-wrapper">
                      <img
                        src={member.image}
                        alt={`${member.name}, ${member.role}`}
                        className="team-image"
                        loading="lazy"
                      />
                      <div className="image-overlay"></div>
                    </div>
                    <div className="team-content">
                      <h3 className="team-name">{member.name}</h3>
                      <p className="team-role">{member.role}</p>
                      <p className="team-bio">{member.bio}</p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              !error && (
                <div className="no-content">
                  <div className="no-content-icon">👥</div>
                  <p className="no-content-message">Our amazing team will be introduced soon!</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values section-padding">
        <div className="container">
          <div className="section-header centered">
            <span className="section-tag">What Drives Us</span>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">🤝</div>
              <h3>Trust</h3>
              <p>Building lasting relationships through transparency and reliability</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🌟</div>
              <h3>Excellence</h3>
              <p>Delivering exceptional experiences that exceed expectations</p>
            </div>
            <div className="value-item">
              <div className="value-icon">💚</div>
              <h3>Sustainability</h3>
              <p>Promoting responsible tourism that preserves our planet</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🎨</div>
              <h3>Innovation</h3>
              <p>Constantly evolving to create unique travel experiences</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="cta section-padding">
        <div className="container">
          <div className="cta-wrapper">
            <div className="cta-content">
              <div className="cta-text">
                <h2 className="cta-title">Ready to Start Your Adventure?</h2>
                <p className="cta-description">
                  Join thousands of happy travelers who've discovered the world with us. 
                  Explore our handcrafted tours and start planning your next unforgettable journey.
                </p>
              </div>
              <div className="cta-actions">
                <Link to="/tours" className="cta-button primary">
                  Explore Tours
                  <span className="button-arrow">→</span>
                </Link>
                <Link to="/contact" className="cta-button secondary">
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="cta-decoration">
              <div className="decoration-circle"></div>
              <div className="decoration-dots"></div>
            </div>
          </div>
        </div>
      </section> */}
    </main>
  );
};

export default AboutUs;