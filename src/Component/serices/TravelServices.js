import React from 'react';
import './TravelServices.css';

const TravelServices = () => {
  const handleBookNow = (service) => {
    alert(`Redirecting to ${service} booking page...`);
  };

  const services = [
    {
      id: 'car-rental',
      title: 'Car Rental',
      description: 'Rent a car for your perfect road trip. Choose from economy to luxury vehicles.',
      features: ['Wide selection of vehicles', '24/7 customer support', 'Flexible pickup locations', 'Competitive pricing'],
      icon: '🚗',
      price: 'Starting from $25/day'
    },
    {
      id: 'flight-booking',
      title: 'Flight Booking',
      description: 'Book domestic and international flights with ease. Best prices guaranteed.',
      features: ['Compare airlines', 'Flexible dates', 'Mobile boarding passes', 'Seat selection'],
      icon: '✈️',
      price: 'Starting from $99'
    },
    {
      id: 'hotel-booking',
      title: 'Hotel Booking',
      description: 'Find and book hotels worldwide. From budget stays to luxury resorts.',
      features: ['Verified reviews', 'Free cancellation', 'Best price guarantee', 'Instant confirmation'],
      icon: '🏨',
      price: 'Starting from $49/night'
    }
  ];

  return (
    <div className="travel-services">
      <div className="container-travel">
        <header className="header">
          <h1>Travel Booking Services</h1>
          <p>Your one-stop destination for all travel needs</p>
        </header>

        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">
                {service.icon}
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              
              <ul className="service-features">
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              
              <div className="service-price">{service.price}</div>
              
              <button 
                className="book-now-btn"
                onClick={() => handleBookNow(service.title)}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelServices;