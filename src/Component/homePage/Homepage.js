// src/pages/HomePage/HomePage.jsx
import React, { useEffect } from 'react';
import './HomePage.css';

// Import data
import { popularDestinations } from './popularDestinations';
import { featuredTours } from './popularDestinations';
import { testimonials } from './popularDestinations';

// Import components
import HeroSection from './HeroSection';
import StatsSection from './StatsSection';
import DestinationsSection from './DestinationsSection';
import ToursSection from './ToursSection';
import FeaturesSection from './FeaturesSection';
import TestimonialsSection from './TestimonialsSection';

import TeamSection from './TeamSection';


const HomePage = () => {
  useEffect(() => {
    // Set a timer to show the login popup after 5 seconds
    const timer = setTimeout(() => {
      // Create and dispatch a custom event to trigger the popup
      const showLoginPopupEvent = new CustomEvent('showLoginPopup');
      window.dispatchEvent(showLoginPopupEvent);
    }, 5000); // 5000 milliseconds = 5 seconds
    
    // Clean up the timer when component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <div className="home-page">
      {/* <Header /> */}
      <HeroSection />
      <StatsSection />
      <DestinationsSection destinations={popularDestinations} />
      <ToursSection tours={featuredTours} />
      <FeaturesSection />
      <TestimonialsSection testimonials={testimonials} />
      <TeamSection/>
     
    </div>
  );
};

export default HomePage;