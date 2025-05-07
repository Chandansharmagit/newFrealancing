import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { setMetaTags } from '../homePage/ViewallDestinations/Utils/setMetaTags';
import { Star, Users, Calendar, MapPin, ChevronRight, Heart } from 'lucide-react';
import './Experiences.css';

const Experiences = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(8);
  
  // Enhanced experience data with more realistic details and categories
  const experiences = [
    {
      id: 1,
      title: 'Himalayan Trek & Mountain Expedition',
      description: 'Challenge yourself with our 7-day Himalayan adventure through pristine trails with expert local guides and breathtaking summit views.',
      image: 'https://data.1freewallpapers.com/download/mountain-peak-tourists-trekking-nature.jpg',
      imageAuthor: 'freepik',
      category: 'adventure',
      duration: '7 days',
      price: '$1,499',
      rating: 4.9,
      reviews: 243,
      featured: true,
      location: 'Nepal'
    },
    {
      id: 2,
      title: 'Traditional Festival & Artisan Workshop Tour',
      description: 'Immerse yourself in authentic local traditions with this 5-day cultural journey featuring ceremonial participation and hands-on craft workshops.',
      image: 'https://vnn-imgs-f.vgcloud.vn/2019/04/18/11/10.jpg',
      imageAuthor: 'freepik',
      category: 'cultural',
      duration: '5 days',
      price: '$899',
      rating: 4.8,
      reviews: 178,
      featured: true,
      location: 'Bali, Indonesia'
    },
    {
      id: 3,
      title: 'Beachfront Wellness & Yoga Retreat',
      description: 'Rejuvenate mind and body at our exclusive oceanside sanctuary offering daily yoga, meditation, and personalized spa treatments.',
      image: 'https://img.freepik.com/premium-photo/beachfront-yoga-retreat-with-daily-classes-healthy-meals_674594-7314.jpg',
      imageAuthor: 'freepik',
      category: 'relaxation',
      duration: '6 days',
      price: '$1,299',
      rating: 4.9,
      reviews: 312,
      featured: true,
      location: 'Koh Samui, Thailand'
    },
    {
      id: 4,
      title: 'African Savanna Wildlife Photography Safari',
      description: 'Capture stunning wildlife photography on this guided 8-day safari through premium game reserves with expert naturalists and comfortable lodging.',
      image: 'https://img.freepik.com/free-photo/elephants-wilderness-african-savanna_23-2151732492.jpg',
      imageAuthor: 'freepik',
      category: 'wildlife',
      duration: '8 days',
      price: '$2,599',
      rating: 4.7,
      reviews: 156,
      featured: true,
      location: 'Tanzania'
    },
    {
      id: 5,
      title: 'Kayaking & Canoeing Expedition',
      description: 'Navigate pristine waterways on this guided 4-day paddling adventure with riverside camping and wildlife spotting opportunities.',
      image: 'https://img.freepik.com/free-photo/kayaking-adventure-scenic-river_23-2151732511.jpg',
      imageAuthor: 'freepik',
      category: 'adventure',
      duration: '4 days',
      price: '$799',
      rating: 4.6,
      reviews: 98,
      featured: false,
      location: 'Oregon, USA'
    },
    {
      id: 6,
      title: 'Historic City Walking Tour & Culinary Experience',
      description: 'Explore ancient streets and savor authentic local cuisine with expert guides on this immersive 3-day cultural exploration.',
      image: 'https://img.freepik.com/free-photo/historic-european-city-streets_23-2151732512.jpg',
      imageAuthor: 'freepik',
      category: 'cultural',
      duration: '3 days',
      price: '$649',
      rating: 4.8,
      reviews: 215,
      featured: false,
      location: 'Florence, Italy'
    },
    {
      id: 7,
      title: 'Mountain Hot Springs & Spa Journey',
      description: 'Unwind in natural thermal springs and receive premium treatments at this 5-day mountain retreat with luxury accommodations.',
      image: 'https://img.freepik.com/free-photo/natural-hot-springs-mountains_23-2151732513.jpg',
      imageAuthor: 'freepik',
      category: 'relaxation',
      duration: '5 days',
      price: '$1,199',
      rating: 4.8,
      reviews: 187,
      featured: false,
      location: 'Iceland'
    },
    {
      id: 8,
      title: 'Rainforest Conservation & Wildlife Expedition',
      description: 'Contribute to wildlife conservation while exploring biodiverse ecosystems on this 6-day guided rainforest adventure.',
      image: 'https://img.freepik.com/free-photo/rainforest-canopy-wildlife-expedition_23-2151732514.jpg',
      imageAuthor: 'freepik',
      category: 'wildlife',
      duration: '6 days',
      price: '$1,399',
      rating: 4.7,
      reviews: 132,
      featured: false,
      location: 'Costa Rica'
    },
    {
      id: 9,
      title: 'Desert Stargazing & Astronomy Tour',
      description: 'Experience breathtaking night skies on this 3-day desert astronomy adventure with professional equipment and expert guides.',
      image: 'https://img.freepik.com/free-photo/desert-night-sky-stargazing_23-2151732515.jpg',
      imageAuthor: 'freepik',
      category: 'adventure',
      duration: '3 days',
      price: '$699',
      rating: 4.9,
      reviews: 74,
      featured: false,
      location: 'Atacama Desert, Chile'
    },
    {
      id: 10,
      title: 'Indigenous Art & Heritage Experience',
      description: 'Connect with indigenous communities through authentic art workshops and cultural exchanges on this immersive 4-day journey.',
      image: 'https://img.freepik.com/free-photo/indigenous-cultural-heritage-experience_23-2151732516.jpg',
      imageAuthor: 'freepik',
      category: 'cultural',
      duration: '4 days',
      price: '$899',
      rating: 4.8,
      reviews: 106,
      featured: false,
      location: 'Australia'
    }
  ];

  // Filter experiences based on active category
  const filteredExperiences = activeCategory === 'all' 
    ? experiences 
    : experiences.filter(exp => exp.category === activeCategory);

  // Filter featured experiences
  const featuredExperiences = experiences.filter(exp => exp.featured);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      quote: "The Himalayan Trek was life-changing! Our guide was incredibly knowledgeable and the scenery was breathtaking. TravelSansar handled everything perfectly.",
      image: "/api/placeholder/80/80",
      rating: 5,
      experience: "Himalayan Trek & Mountain Expedition"
    },
    {
      id: 2,
      name: "David Chen",
      location: "Melbourne, Australia",
      quote: "The cultural immersion in Bali exceeded all expectations. We participated in ceremonies that tourists typically don't see and made connections with local artisans.",
      image: "/api/placeholder/80/80",
      rating: 5,
      experience: "Traditional Festival & Artisan Workshop Tour"
    },
    {
      id: 3,
      name: "Priya Patel",
      location: "London, UK",
      quote: "The beachfront retreat was exactly what I needed. The yoga instructors were world-class and the private villa accommodations were stunning.",
      image: "/api/placeholder/80/80",
      rating: 4,
      experience: "Beachfront Wellness & Yoga Retreat"
    }
  ];

  // Load more experiences
  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, filteredExperiences.length));
  };

  // Set Meta Tags and Structured Data
  useEffect(() => {
    // Structured Data for Organization (JSON-LD)
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'TravelSansar',
      url: 'https://travelsansar.com',
      logo: 'https://travelsansar.com/logo.png',
      description: 'TravelSansar offers unique travel experiences, from adventure expeditions to cultural immersions and relaxation retreats.',
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

    const metaConfig = {
      title: 'Curated Travel Experiences | TravelSansar',
      description: 'Discover authentic, expertly-guided travel experiences with TravelSansar. From thrilling adventures to cultural immersions, relaxing retreats, and wildlife encounters.',
      keywords: 'premium travel experiences, adventure tours, cultural immersion, wellness retreats, wildlife safaris, luxury travel, guided tours, TravelSansar',
      robots: 'index, follow',
      canonical: 'https://travelsansar.com/experiences',
      structuredData,
    };

    const cleanup = setMetaTags(metaConfig);
    return cleanup;
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="experiences-page">
      {/* Hero Section */}
      <section className="experiences-hero">
        <div className="experiences-hero-content">
          <div className="experiences-container">
            <span className="experiences-hero-badge">Trusted by 50,000+ travelers</span>
            <h1 className="experiences-hero-title">Extraordinary Journeys, <br/>Exceptional Memories</h1>
            <p className="experiences-hero-subtitle">
              Curated travel experiences designed by experts with a passion for authenticity and sustainability
            </p>
            <div className="experiences-hero-cta">
              <Link to="/tours" className="experiences-primary-button">Explore All Experiences</Link>
              <Link to="/contact" className="experiences-secondary-button">Speak to an Expert</Link>
            </div>
            <div className="experiences-trust-indicators">
              <div className="experiences-trust-item">
                <img src="/api/placeholder/120/40" alt="TripAdvisor Choice Award" className="experiences-trust-logo" />
              </div>
              <div className="experiences-trust-item">
                <img src="/api/placeholder/120/40" alt="National Geographic Featured" className="experiences-trust-logo" />
              </div>
              <div className="experiences-trust-item">
                <img src="/api/placeholder/120/40" alt="Responsible Tourism Certified" className="experiences-trust-logo" />
              </div>
            </div>
          </div>
        </div>
        <img
          src="https://data.1freewallpapers.com/download/mountain-peak-tourists-trekking-nature.jpg"
          alt="Breathtaking mountain landscape at sunset"
          className="experiences-hero-img"
          loading="eager"
        />
        <p className="experiences-image-credit">Image by <a href="https://www.freepik.com">Freepik</a></p>
      </section>

      {/* Featured Experiences */}
      <section className="experiences-featured-section">
        <div className="experiences-container">
          <div className="experiences-section-header">
            <h2 className="experiences-section-title">Featured Experiences</h2>
            <p className="experiences-section-subtitle">Our most popular and highly-rated travel experiences</p>
          </div>
          
          <div className="experiences-featured-grid">
            {featuredExperiences.map(experience => (
              <article key={experience.id} className="experiences-featured-card">
                <div className="experiences-card-image-container">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="experiences-card-img"
                    loading="lazy"
                  />
                  <div className="experiences-card-price">{experience.price}</div>
                  <button className="experiences-card-favorite" aria-label="Save to favorites">
                    <Heart size={18} />
                  </button>
                </div>
                <div className="experiences-card-content">
                  <div className="experiences-card-meta">
                    <span className="experiences-card-category">{experience.category}</span>
                    <span className="experiences-card-rating">
                      <Star size={14} className="experiences-icon" /> {experience.rating} 
                      <span className="experiences-card-reviews">({experience.reviews})</span>
                    </span>
                  </div>
                  <h3 className="experiences-card-title">{experience.title}</h3>
                  <p className="experiences-card-description">{experience.description}</p>
                  <div className="experiences-card-details">
                    <div className="experiences-card-detail">
                      <Calendar size={16} className="experiences-icon" />
                      <span>{experience.duration}</span>
                    </div>
                    <div className="experiences-card-detail">
                      <MapPin size={16} className="experiences-icon" />
                      <span>{experience.location}</span>
                    </div>
                    <div className="experiences-card-detail">
                      <Users size={16} className="experiences-icon" />
                      <span>Small groups</span>
                    </div>
                  </div>
                  <Link to={`/experiences/${experience.id}`} className="experiences-card-button">
                    View Details <ChevronRight size={16} className="experiences-icon" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="experiences-why-us-section">
        <div className="experiences-container">
          <div className="experiences-section-header">
            <h2 className="experiences-section-title">Why Travel With Us</h2>
            <p className="experiences-section-subtitle">What makes TravelSansar experiences truly exceptional</p>
          </div>
          
          <div className="experiences-why-us-grid">
            <div className="experiences-why-us-item">
              <div className="experiences-why-us-icon">
                <img src="/api/placeholder/60/60" alt="Expert guides icon" />
              </div>
              <h3 className="experiences-why-us-title">Expert Local Guides</h3>
              <p className="experiences-why-us-description">
                Our guides are certified professionals with extensive local knowledge and years of experience.
              </p>
            </div>
            
            <div className="experiences-why-us-item">
              <div className="experiences-why-us-icon">
                <img src="/api/placeholder/60/60" alt="Small groups icon" />
              </div>
              <h3 className="experiences-why-us-title">Small Group Sizes</h3>
              <p className="experiences-why-us-description">
                Maximum of 12 travelers per group ensures personalized attention and authentic experiences.
              </p>
            </div>
            
            <div className="experiences-why-us-item">
              <div className="experiences-why-us-icon">
                <img src="/api/placeholder/60/60" alt="Responsible tourism icon" />
              </div>
              <h3 className="experiences-why-us-title">Responsible Tourism</h3>
              <p className="experiences-why-us-description">
                Carbon-offset trips that support local communities and minimize environmental impact.
              </p>
            </div>
            
            <div className="experiences-why-us-item">
              <div className="experiences-why-us-icon">
                <img src="/api/placeholder/60/60" alt="24/7 support icon" />
              </div>
              <h3 className="experiences-why-us-title">24/7 Support</h3>
              <p className="experiences-why-us-description">
                Dedicated assistance throughout your journey for peace of mind and seamless travel.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* All Experiences Section */}
      <section className="experiences-all-section">
        <div className="experiences-container">
          <div className="experiences-section-header">
            <h2 className="experiences-section-title">Explore All Experiences</h2>
            <p className="experiences-section-subtitle">Find your perfect journey from our curated collection</p>
          </div>
          
          {/* Category Filters */}
          <div className="experiences-categories">
            <button 
              className={`experiences-category-button ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Experiences
            </button>
            <button 
              className={`experiences-category-button ${activeCategory === 'adventure' ? 'active' : ''}`}
              onClick={() => setActiveCategory('adventure')}
            >
              Adventure
            </button>
            <button 
              className={`experiences-category-button ${activeCategory === 'cultural' ? 'active' : ''}`}
              onClick={() => setActiveCategory('cultural')}
            >
              Cultural
            </button>
            <button 
              className={`experiences-category-button ${activeCategory === 'relaxation' ? 'active' : ''}`}
              onClick={() => setActiveCategory('relaxation')}
            >
              Relaxation
            </button>
            <button 
              className={`experiences-category-button ${activeCategory === 'wildlife' ? 'active' : ''}`}
              onClick={() => setActiveCategory('wildlife')}
            >
              Wildlife
            </button>
          </div>
          
          {/* Experiences Grid */}
          <div className="experiences-grid">
            {filteredExperiences.slice(0, visibleCount).map(experience => (
              <article key={experience.id} className="experiences-card">
                <div className="experiences-card-image-container">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="experiences-card-img"
                    loading="lazy"
                  />
                  <div className="experiences-card-price">{experience.price}</div>
                  <button className="experiences-card-favorite" aria-label="Save to favorites">
                    <Heart size={18} />
                  </button>
                </div>
                <div className="experiences-card-content">
                  <div className="experiences-card-meta">
                    <span className="experiences-card-category">{experience.category}</span>
                    <span className="experiences-card-rating">
                      <Star size={14} className="experiences-icon" /> {experience.rating} 
                      <span className="experiences-card-reviews">({experience.reviews})</span>
                    </span>
                  </div>
                  <h3 className="experiences-card-title">{experience.title}</h3>
                  <div className="experiences-card-details">
                    <div className="experiences-card-detail">
                      <Calendar size={16} className="experiences-icon" />
                      <span>{experience.duration}</span>
                    </div>
                    <div className="experiences-card-detail">
                      <MapPin size={16} className="experiences-icon" />
                      <span>{experience.location}</span>
                    </div>
                  </div>
                  <Link to={`/experiences/${experience.id}`} className="experiences-card-button">
                    View Details <ChevronRight size={16} className="experiences-icon" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          
          {/* Load More Button */}
          {visibleCount < filteredExperiences.length && (
            <div className="experiences-load-more">
              <button onClick={handleLoadMore} className="experiences-load-button">
                Load More Experiences
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="experiences-testimonials-section">
        <div className="experiences-container">
          <div className="experiences-section-header">
            <h2 className="experiences-section-title">What Our Travelers Say</h2>
            <p className="experiences-section-subtitle">Authentic reviews from recent TravelSansar explorers</p>
          </div>
          
          <div className="experiences-testimonials-grid">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="experiences-testimonial-card">
                <div className="experiences-testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={`experiences-icon ${i < testimonial.rating ? 'filled' : ''}`} 
                    />
                  ))}
                </div>
                <p className="experiences-testimonial-quote">"{testimonial.quote}"</p>
                <div className="experiences-testimonial-footer">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="experiences-testimonial-image" 
                  />
                  <div className="experiences-testimonial-info">
                    <p className="experiences-testimonial-name">{testimonial.name}</p>
                    <p className="experiences-testimonial-location">{testimonial.location}</p>
                    <p className="experiences-testimonial-experience">{testimonial.experience}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="experiences-testimonials-cta">
            <Link to="/reviews" className="experiences-secondary-button">Read All Reviews</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="experiences-cta-section">
        <div className="experiences-container">
          <div className="experiences-cta-content">
            <h2 className="experiences-cta-title">Ready to Start Your Journey?</h2>
            <p className="experiences-cta-text">
              Join thousands of travelers who have trusted TravelSansar for their most memorable experiences
            </p>
            <div className="experiences-cta-buttons">
              <Link to="/tours" className="experiences-primary-button">Browse Experiences</Link>
              <Link to="/custom" className="experiences-secondary-button">Create Custom Trip</Link>
            </div>
            <div className="experiences-cta-guarantee">
              <img src="/api/placeholder/24/24" alt="Guarantee icon" className="experiences-guarantee-icon" />
              <p>100% Satisfaction Guarantee | Flexible Booking & Free Cancellation Policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="experiences-newsletter-section">
        <div className="experiences-container">
          <div className="experiences-newsletter-content">
            <h2 className="experiences-newsletter-title">Get Exclusive Travel Offers</h2>
            <p className="experiences-newsletter-text">
              Subscribe to our newsletter for early access to new experiences and special promotions
            </p>
            <form className="experiences-newsletter-form">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="experiences-newsletter-input" 
                aria-label="Email address"
                required 
              />
              <button type="submit" className="experiences-newsletter-button">Subscribe</button>
            </form>
            <p className="experiences-newsletter-privacy">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Experiences;