import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setMetaTags } from '../homePage/ViewallDestinations/Utils/setMetaTags';
import './AboutUs.css';

const AboutUs = () => {
  // Team data (hardcoded for simplicity)
  const teamMembers = [
    {
      id: 1,
      name: 'Jane Doe',
      role: 'Founder & CEO',
      image: '/images/team/jane-doe.jpg',
      bio: 'Passionate about creating unforgettable travel experiences.',
    },
    {
      id: 2,
      name: 'John Smith',
      role: 'Lead Guide',
      image: '/images/team/john-smith.jpg',
      bio: 'Expert in adventure tours with 15 years of experience.',
    },
    {
      id: 3,
      name: 'Emily Chen',
      role: 'Marketing Director',
      image: '/images/team/emily-chen.jpg',
      bio: 'Drives our mission to share travel stories worldwide.',
    },
  ];

  // Structured Data for Organization (JSON-LD)
  const structuredData = {
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
  };

  // Set Meta Tags and Structured Data
  useEffect(() => {
    const metaConfig = {
      title: 'About Us - TravelSansar',
      description: 'Learn about TravelSansar, our mission to create unforgettable travel experiences, and meet our passionate team.',
      keywords: 'about TravelSansar, travel agency, our story, mission, team, travel experiences',
      robots: 'index, follow',
      canonical: 'https://travelsansar.com/about',
      structuredData,
    };

    const cleanup = setMetaTags(metaConfig);
    return cleanup;
  }, []);

  return (
    <main className="about-us">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="container">
            <h1 className="hero-title">About TravelSansar</h1>
            <p className="hero-subtitle">Crafting unforgettable journeys since 2010</p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="story section-padding">
        <div className="container">
          <div className="flex-wrapper">
            <div className="content-box" data-aos="fade-right">
              <h2 className="section-title">Our Story</h2>
              <p className="section-text">
                Founded in 2010, TravelSansar began with a simple vision: to share the world's beauty through authentic travel experiences. From humble beginnings organizing local tours, we've grown into a global travel agency, curating handpicked itineraries that inspire adventure and connection.
              </p>
              <p className="section-text">
                Every tour is designed with care, blending cultural immersion, adventure, and comfort. Whether you're exploring ancient ruins or relaxing on pristine beaches, we're here to make your travel dreams a reality.
              </p>
            </div>
            <div className="image-box" data-aos="fade-left">
              <img
                src="/images/about-story.jpg"
                alt="TravelSansar team planning a tour"
                className="responsive-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision section-padding accent-bg">
        <div className="container">
          <div className="card-grid">
            <div className="card" data-aos="fade-up">
              <h3 className="card-title">Our Mission</h3>
              <p className="card-text">
                To inspire and empower travelers to explore the world with curiosity, creating meaningful experiences that connect people and cultures.
              </p>
            </div>
            <div className="card" data-aos="fade-up" data-aos-delay="100">
              <h3 className="card-title">Our Vision</h3>
              <p className="card-text">
                To be the leading travel agency that transforms journeys into stories, fostering a global community of explorers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team section-padding">
        <div className="container">
          <h2 className="section-title text-center" data-aos="fade-up">Meet Our Team</h2>
          <p className="section-text text-center" data-aos="fade-up">
            Our dedicated team of travel enthusiasts is here to make your journey unforgettable.
          </p>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <article 
                key={member.id} 
                className="team-card" 
                data-aos="fade-up" 
                data-aos-delay={index * 100}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <img
                      src={member.image}
                      alt={`${member.name}, ${member.role}`}
                      className="team-img"
                      loading="lazy"
                    />
                    <h3 className="team-name">{member.name}</h3>
                    <p className="team-role">{member.role}</p>
                  </div>
                  <div className="card-back">
                    <p className="team-bio">{member.bio}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta section-padding">
        <div className="container">
          <div className="cta-content" data-aos="zoom-in">
            <h2 className="section-title">Ready to Explore?</h2>
            <p className="section-text">
              Join us on a journey of discovery. Explore our handcrafted tours and start planning your next adventure today.
            </p>
            <Link
              to="/tours"
              className="cta-button"
              aria-label="Explore all tours"
            >
              Explore Tours
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;