import React, { useState } from 'react';
import './TravelDestinations.css';

// Destination data with Freepik placeholder image URLs
const destinations = [
  {
    id: 1,
    name: 'Bali, Indonesia',
    description:
      'Tropical paradise with stunning beaches, lush rice terraces, and vibrant culture. Enjoy surfing, visit ancient temples, and experience the unique Balinese culture through traditional dance performances and local cuisine.',
    shortDescription: 'Experience paradise in Southeast Asia',
    image: 'https://img.freepik.com/free-photo/beautiful-tropical-beach_74190-677.jpg',
    price: '$1,200',
    duration: '7 days',
  },
  {
    id: 2,
    name: 'Santorini, Greece',
    description:
      'Famous for its stunning white architecture, blue domes, and breathtaking sunsets over the Mediterranean Sea. Explore charming villages, relax on unique volcanic beaches, and savor delicious Greek cuisine with local wine.',
    shortDescription: 'Experience the magic of Greek islands',
    image: 'https://img.freepik.com/free-photo/santorini-island-architecture_23-2148963174.jpg',
    price: '$1,800',
    duration: '6 days',
  },
  {
    id: 3,
    name: 'Kyoto, Japan',
    description:
      'Ancient city with over 1,600 Buddhist temples, beautiful gardens, and traditional wooden architecture. Witness cherry blossoms in spring, participate in a traditional tea ceremony, and stroll through the mystical Arashiyama Bamboo Grove.',
    shortDescription: 'Immerse yourself in Japanese tradition',
    image: 'https://img.freepik.com/free-photo/japanese-temple-surrounded-by-nature_23-2148978045.jpg',
    price: '$2,100',
    duration: '8 days',
  },
  {
    id: 4,
    name: 'Machu Picchu, Peru',
    description:
      'Iconic 15th-century Inca citadel set high in the Andes Mountains, offering incredible views and ancient history. Trek the famous Inca Trail and discover the mysteries of this UNESCO World Heritage site that attracts visitors from around the world.',
    shortDescription: 'Discover the ancient wonder',
    image: 'https://img.freepik.com/free-photo/machu-picchu-ruins-peru_23-2148978032.jpg',
    price: '$1,950',
    duration: '9 days',
  },
  {
    id: 5,
    name: 'Paris, France',
    description:
      'The City of Light features iconic landmarks like the Eiffel Tower, exquisite cuisine, and world-class museums. Wander charming neighborhoods, visit the Louvre, and enjoy romantic Seine River cruises while indulging in delicious pastries and wine.',
    shortDescription: 'Romance awaits in the City of Light',
    image: 'https://img.freepik.com/free-photo/eiffel-tower-paris_74190-1239.jpg',
    price: '$1,600',
    duration: '5 days',
  },
  {
    id: 6,
    name: 'Cape Town, South Africa',
    description:
      'Breathtaking coastal city with Table Mountain, pristine beaches, and incredible wildlife nearby. Take a cable car to the mountain top, visit the penguin colony at Boulders Beach, and explore the vibrant Victoria & Alfred Waterfront.',
    shortDescription: 'Where mountains meet the sea',
    image: 'https://img.freepik.com/free-photo/cape-town-south-africa_74190-104.jpg',
    price: '$1,750',
    duration: '10 days',
  },
];

function TravelDestinations() {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const openPopup = (destination) => {
    setSelectedDestination(destination);
  };

  const closePopup = () => {
    setSelectedDestination(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className={`travel-page ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Dark Mode Toggle */}
      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      {/* Main Content */}
      <main className="container">
        <h2 className="section-title">Popular Destinations</h2>

        {/* Destinations Grid */}
        <div className="destinations-grid">
          {destinations.map((destination) => (
            <div key={destination.id} className="destination-card">
              <div className="destination-image">
                <img src={destination.image} alt={destination.name} loading="lazy" />
              </div>
              <div className="destination-info">
                <h3>{destination.name}</h3>
                <p>{destination.shortDescription}</p>
                <div className="destination-meta">
                  <span className="price">{destination.price}</span>
                  <span className="duration">{destination.duration}</span>
                </div>
                <button
                  className="view-details-btn"
                  onClick={() => openPopup(destination)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Popup/Modal */}
      {selectedDestination && (
        <div className="destination-popup-overlay" onClick={closePopup}>
          <div className="destination-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup" onClick={closePopup}>
              ×
            </button>
            <div className="popup-image">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                loading="lazy"
              />
            </div>
            <div className="popup-content">
              <h3>{selectedDestination.name}</h3>
              <div className="popup-meta">
                <span className="price">{selectedDestination.price}</span>
                <span className="duration">{selectedDestination.duration}</span>
              </div>
              <p className="popup-description">
                {selectedDestination.description}
              </p>
              <button className="book-now-btn">Book Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Freepik Attribution */}
      <footer className="freepik-attribution">
        <p>
          Images by{' '}
          <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer">
            Freepik
          </a>
        </p>
      </footer>
    </div>
  );
}

export default TravelDestinations;