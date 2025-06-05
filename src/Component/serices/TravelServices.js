import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TravelServices.css';

const TravelServices = () => {
  const navigate = useNavigate();

  const handleBookNow = (service, serviceId) => {
    // Navigate to the specific service page
    navigate(`/${serviceId}`);
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
    <div className="ts-travel-services-2025">
      <div className="ts-container-travel-2025">
        <header className="ts-header-unique">
          <h1>Travel Booking Services</h1>
          <p>Your one-stop destination for all travel needs</p>
        </header>

        <div className="ts-services-grids-2025">
          {services.map((service) => (
            <div key={service.id} className="ts-service-card-unique">
              <div className="ts-service-icon-2025">
                {service.icon}
              </div>
              <h3 className="ts-service-title-unique">{service.title}</h3>
              <p className="ts-service-description-2025">{service.description}</p>
              
              <ul className="ts-service-features-unique">
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              
              <div className="ts-service-price-2025">{service.price}</div>
              
              <button 
                className="ts-book-now-btn-unique"
                onClick={() => handleBookNow(service.title, service.id)}
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