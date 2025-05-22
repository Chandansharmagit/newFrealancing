import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { setMetaTags } from '../homePage/ViewallDestinations/Utils/setMetaTags';
import { Star, Users, Calendar, MapPin, ChevronRight, Heart, Loader } from 'lucide-react';
import './Experiences.css';

const Experiences = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(8);
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [destinationsResponse, toursResponse] = await Promise.all([
          fetch('https://backendtravelagency.onrender.com/api/destinations').catch(err => {
            console.error('Destinations API fetch error:', err);
            return { ok: false, status: 500 };
          }),
          fetch('https://backendtravelagencytwomicroservice.onrender.com/api/tours').catch(err => {
            console.error('Tours API fetch error:', err);
            return { ok: false, status: 500 };
          })
        ]);

        let destinationsArray = [];
        let toursArray = [];

        if (destinationsResponse.ok) {
          const destinationsData = await destinationsResponse.json();
          console.log('Destinations API Response:', {
            isArray: Array.isArray(destinationsData),
            data: destinationsData,
            hasData: destinationsData && destinationsData.length > 0,
            hasIds: Array.isArray(destinationsData) && destinationsData.every(item => item._id)
          });
          destinationsArray = Array.isArray(destinationsData)
            ? destinationsData
            : destinationsData && Array.isArray(destinationsData.data)
              ? destinationsData.data
              : [];
        } else {
          console.error(`Destinations API failed with status: ${destinationsResponse.status}`);
        }

        if (toursResponse.ok) {
          const toursData = await toursResponse.json();
          console.log('Tours API Response:', {
            isArray: Array.isArray(toursData),
            data: toursData,
            hasData: toursData && toursData.length > 0,
            hasIds: Array.isArray(toursData) && toursData.every(item => item._id)
          });
          toursArray = Array.isArray(toursData)
            ? toursData
            : toursData && Array.isArray(toursData.data)
              ? toursData.data
              : [];
        } else {
          console.error(`Tours API failed with status: ${toursResponse.status}`);
        }

        console.log('Setting destinations:', destinationsArray);
        console.log('Setting tours:', toursArray);

        setDestinations(destinationsArray);
        setTours(toursArray);

        if (destinationsArray.length === 0 && toursArray.length === 0) {
          setError('No data available from either API');
        } else if (toursArray.length === 0) {
          console.warn('No tours data available; displaying destinations only');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const transformedExperiences = React.useMemo(() => {
    const experiences = [];

    const getStableRandom = (seed, min, max) => {
      const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return min + (hash % (max - min + 1));
    };

    console.log('Processing destinations:', destinations);
    if (Array.isArray(destinations)) {
      destinations.forEach(destination => {
        const featuredImage = Array.isArray(destination.images) 
          ? destination.images.find(img => img.isFeatured) || destination.images[0] 
          : null;
        
        const description = destination.description?.toLowerCase() || '';
        let category = 'cultural';
        if (description.includes('hiking') || description.includes('trekking') || destination.title?.toLowerCase().includes('trek')) {
          category = 'adventure';
        } else if (description.includes('wildlife') || destination.title?.toLowerCase().includes('safari')) {
          category = 'wildlife';
        } else if (description.includes('relax') || description.includes('spa')) {
          category = 'relaxation';
        }

        const experience = {
          id: `dest-${destination._id || 'unknown'}`,
          rawId: destination._id || 'unknown',
          title: destination.title || 'Unnamed Destination',
          description: destination.description?.substring(0, 150) + '...' || 'Explore this amazing destination',
          image: featuredImage?.path || 'https://via.placeholder.com/400x300',
          category,
          duration: destination.duration || 'Variable',
          price: destination.price || 'Contact for pricing',
          rating: 4.5 + (getStableRandom(destination._id || 'default', 0, 5) / 10),
          reviews: getStableRandom(destination._id || 'default', 50, 200),
          featured: getStableRandom(destination._id || 'default', 0, 100) > 70,
          location: destination.location || 'Nepal',
          type: 'destination',
          bestTimeToVisit: destination.bestTimeToVisit,
          thingsToDo: destination.thingsToDo
        };

        experiences.push(experience);
        console.log('Added destination:', {
          title: experience.title,
          category: experience.category,
          image: experience.image,
          location: experience.location,
          price: experience.price,
          duration: experience.duration,
          featured: experience.featured,
          rating: experience.rating,
          reviews: experience.reviews
        });
      });
    } else {
      console.warn('Destinations is not an array:', destinations);
    }

    console.log('Processing tours:', tours);
    if (Array.isArray(tours)) {
      tours.forEach(tour => {
        const featuredImage = Array.isArray(tour.images) 
          ? tour.images.find(img => img.isFeatured) || tour.images[0] 
          : null;
        
        const description = tour.description?.toLowerCase() || '';
        let category = 'adventure';
        if (description.includes('cultural') || tour.name?.toLowerCase().includes('cultural')) {
          category = 'cultural';
        } else if (description.includes('wildlife') || tour.name?.toLowerCase().includes('safari')) {
          category = 'wildlife';
        } else if (description.includes('relax') || tour.name?.toLowerCase().includes('retreat')) {
          category = 'relaxation';
        }

        const experience = {
          id: `tour-${tour._id || 'unknown'}`,
          rawId: tour._id || 'unknown',
          title: tour.name || 'Unnamed Tour',
          description: tour.description?.substring(0, 150) + '...' || 'Join this amazing tour experience',
          image: featuredImage?.url || 'https://via.placeholder.com/400x300',
          category,
          duration: tour.duration || '1 day',
          price: tour.price ? `$${tour.price}` : 'Contact for pricing',
          rating: 4.3 + (getStableRandom(tour._id || 'default', 0, 7) / 10),
          reviews: getStableRandom(tour._id || 'default', 30, 150),
          featured: getStableRandom(tour._id || 'default', 0, 100) > 60,
          location: tour.location || 'Nepal',
          type: 'tour',
          maxTravelers: tour.maxTravelers,
          itinerary: tour.itinerary,
          inclusions: tour.inclusions
        };

        experiences.push(experience);
        console.log('Added tour:', {
          title: experience.title,
          category: experience.category,
          image: experience.image,
          location: experience.location,
          price: experience.price,
          duration: experience.duration,
          featured: experience.featured
        });
      });
    } else {
      console.warn('Tours is not an array:', tours);
    }

    if (experiences.length > 0 && experiences.every(exp => !exp.featured)) {
      const sortedExperiences = experiences.sort((a, b) => b.rating - a.rating);
      sortedExperiences[0].featured = true;
      console.log('Forced featured experience:', sortedExperiences[0].title);
    }

    console.log('Final transformed experiences:', experiences.map(exp => ({
      title: exp.title,
      category: exp.category,
      featured: exp.featured
    })));
    return experiences;
  }, [destinations, tours]);

  const filteredExperiences = activeCategory === 'all' 
    ? transformedExperiences 
    : transformedExperiences.filter(exp => exp.category === activeCategory);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, filteredExperiences.length));
  };

  const handleNewsletterSubscribe = () => {
    alert('Subscribed to newsletter!');
  };

  useEffect(() => {
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <main className="experiences-page">
        <div className="experiences-loading">
          <div className="experiences-container">
            <div className="experiences-loading-content">
              <Loader className="experiences-loading-spinner" size={48} aria-label="Loading experiences" />
              <h2>Loading Amazing Experiences...</h2>
              <p>We're fetching the best travel experiences for you</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="experiences-page">
        <div className="experiences-error">
          <div className="experiences-container">
            <div className="experiences-error-content">
              <h2>Oops! Something went wrong</h2>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="experiences-primary-button"
                aria-label="Reload page"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="experiences-page">
      <section className="experiences-hero">
        <div className="experiences-hero-content">
          <div className="experiences-container">
            <span className="experiences-hero-badge">Trusted by 50,000+ travelers</span>
            <h1 className="experiences-hero-title">Extraordinary Journeys, <br/>Exceptional Memories</h1>
            <p className="experiences-hero-subtitle">
              Curated travel experiences designed by experts with a passion for authenticity and sustainability
            </p>
            <div className="experiences-hero-cta">
              <Link to="/tours" className="experiences-primary-button" aria-label="Explore all experiences">Explore All Experiences</Link>
              <Link to="/contact" className="experiences-secondary-button" aria-label="Contact an expert">Speak to an Expert</Link>
            </div>
            <div className="experiences-trust-indicators">
              <div className="experiences-trust-item">
                <img src="https://via.placeholder.com/120x40" alt="TripAdvisor Choice Award" className="experiences-trust-logo" />
              </div>
              <div className="experiences-trust-item">
                <img src="https://via.placeholder.com/120x40" alt="National Geographic Featured" className="experiences-trust-logo" />
              </div>
              <div className="experiences-trust-item">
                <img src="https://via.placeholder.com/120x40" alt="Responsible Tourism Certified" className="experiences-trust-logo" />
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

      <section className="experiences-featured-section">
        <div className="experiences-container">
          <div className="experiences-section-header">
            <h2 className="experiences-section-title">Featured Experiences</h2>
            <p className="experiences-section-subtitle">Our most popular and highly-rated travel experiences</p>
          </div>
          
          {transformedExperiences.length > 0 ? (
            <div className="experiences-featured-grid">
              {transformedExperiences
                .sort((a, b) => (b.featured - a.featured) || (b.rating - a.rating))
                .slice(0, 4)
                .map(experience => (
                  <article key={experience.id} className="experiences-featured-card">
                    <div className="experiences-card-image-container">
                      <img
                        src={experience.image}
                        alt='images of exp'
                        className="experiences-card-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300';
                        }}
                      />
                      <div className="experiences-card-price">{experience.price}</div>
                      <button 
                        className="experiences-card-favorite" 
                        aria-label={`Add ${experience.title} to favorites`}
                      >
                        <Heart size={18} />
                      </button>
                    </div>
                    <div className="experiences-card-content">
                      <div className="experiences-card-meta">
                        <span className="experiences-card-category">{experience.category}</span>
                        <span className="experiences-card-rating">
                          <Star size={14} className="experiences-icon" /> {experience.rating.toFixed(1)} 
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
                          <span>{experience.type === 'tour' && experience.maxTravelers ? `Max ${experience.maxTravelers}` : 'Small groups'}</span>
                        </div>
                      </div>
                      <Link 
                        to={experience.type === 'tour' ? `/tour/${experience.rawId}` : `/destination/${experience.rawId}`} 
                        className="experiences-card-button"
                        aria-label={`View details for ${experience.title}`}
                      >
                        View Details <ChevronRight size={16} className="experiences-icon" />
                      </Link>
                    </div>
                  </article>
                ))}
            </div>
          ) : (
            <div className="experiences-no-results">
              <p>No experiences available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      <section className="experiences-why-us-section">
        <div className="experiences-container">
          <div className="experiences-section-header">
            <h2 className="experiences-section-title">Why Travel With Us</h2>
            <p className="experiences-section-subtitle">What makes TravelSansar experiences truly exceptional</p>
          </div>
          
          <div className="experiences-why-us-grid">
            <div className="experiences-why-us-item">
              <div className="experiences-why-us-icon">
                <img src="https://via.placeholder.com/60" alt="Expert guides icon" />
              </div>
              <h3 className="experiences-why-us-title">Expert Local Guides</h3>
              <p className="experiences-why-us-description">
                Our guides are certified professionals with extensive local knowledge and years of experience.
              </p>
            </div>
            
            <div className="experiences-why-us-item">
              <div className="experiences-why-us-icon">
                <img src="https://via.placeholder.com/60" alt="Small groups icon" />
              </div>
              <h3 className="experiences-why-us-title">Small Group Sizes</h3>
              <p className="experiences-why-us-description">
                Maximum of 12 travelers per group ensures personalized attention and authentic experiences.
              </p>
            </div>
            
            <div className="experiences-why-us-item">
              <div className="experiences-why-us-icon">
                <img src="https://via.placeholder.com/60" alt="Responsible tourism icon" />
              </div>
              <h3 className="experiences-why-us-title">Responsible Tourism</h3>
              <p className="experiences-why-us-description">
                Carbon-offset trips that support local communities and minimize environmental impact.
              </p>
            </div>
            
            <div className="experiences-why-us-item">
              <div className="experiences-why-us-icon">
                <img src="https://via.placeholder.com/60" alt="24/7 support icon" />
              </div>
              <h3 className="experiences-why-us-title">24/7 Support</h3>
              <p className="experiences-why-us-description">
                Dedicated assistance throughout your journey for peace of mind and seamless travel.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="experiences-all-section">
        <div className="experiences-container">
          <div className="experiences-section-header">
            <h2 className="experiences-section-title">Explore All Experiences</h2>
            <p className="experiences-section-subtitle">Find your perfect journey from our curated collection</p>
          </div>
          
          {tours.length === 0 && destinations.length > 0 && (
            <div className="experiences-warning">
              <p>Currently displaying destinations only. Tours are temporarily unavailable.</p>
            </div>
          )}

          <div className="experiences-categories">
            <button 
              className={`experiences-category-button ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
              aria-label="Show all experiences"
            >
              All Experiences ({transformedExperiences.length})
            </button>
            <button 
              className={`experiences-category-button ${activeCategory === 'adventure' ? 'active' : ''}`}
              onClick={() => setActiveCategory('adventure')}
              aria-label="Show adventure experiences"
            >
              Adventure ({transformedExperiences.filter(exp => exp.category === 'adventure').length})
            </button>
            <button 
              className={`experiences-category-button ${activeCategory === 'cultural' ? 'active' : ''}`}
              onClick={() => setActiveCategory('cultural')}
              aria-label="Show cultural experiences"
            >
              Cultural ({transformedExperiences.filter(exp => exp.category === 'cultural').length})
            </button>
            <button 
              className={`experiences-category-button ${activeCategory === 'relaxation' ? 'active' : ''}`}
              onClick={() => setActiveCategory('relaxation')}
              aria-label="Show relaxation experiences"
            >
              Relaxation ({transformedExperiences.filter(exp => exp.category === 'relaxation').length})
            </button>
            <button 
              className={`experiences-category-button ${activeCategory === 'wildlife' ? 'active' : ''}`}
              onClick={() => setActiveCategory('wildlife')}
              aria-label="Show wildlife experiences"
            >
              Wildlife ({transformedExperiences.filter(exp => exp.category === 'wildlife').length})
            </button>
          </div>
          
          {filteredExperiences.length > 0 ? (
            <>
              <div className="experiences-grid">
                {filteredExperiences.slice(0, visibleCount).map(experience => (
                  <article key={experience.id} className="experiences-card">
                    <div className="experiences-card-image-container">
                      <img
                        src={experience.image}
                        alt="images if dest"
                        className="experiences-card-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300';
                        }}
                      />
                      <div className="experiences-card-price">{experience.price}</div>
                      <button 
                        className="experiences-card-favorite" 
                        aria-label={`Add ${experience.title} to favorites`}
                      >
                        <Heart size={18} />
                      </button>
                    </div>
                    <div className="experiences-card-content">
                      <div className="experiences-card-meta">
                        <span className="experiences-card-category">{experience.category}</span>
                        <span className="experiences-card-rating">
                          <Star size={14} className="experiences-icon" /> {experience.rating.toFixed(1)} 
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
                      <Link 
                        to={experience.type === 'tour' ? `/tour/${experience.rawId}` : `/destination/${experience.rawId}`} 
                        className="experiences-card-button"
                        aria-label={`View details for ${experience.title}`}
                      >
                        View Details <ChevronRight size={16} className="experiences-icon" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              
              {visibleCount < filteredExperiences.length && (
                <div className="experiences-load-more">
                  <button 
                    onClick={handleLoadMore} 
                    className="experiences-load-button"
                    aria-label={`Load more experiences, ${filteredExperiences.length - visibleCount} remaining`}
                  >
                    Load More Experiences ({filteredExperiences.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="experiences-no-results">
              <p>No experiences found for the selected category.</p>
            </div>
          )}
        </div>
      </section>

      <section className="experiences-testimonials-section">
        <div className="experiences-container">
          <div className="experiences-section-header">
            <h2 className="experiences-section-title">What Our Travelers Say</h2>
            <p className="experiences-section-subtitle">Authentic reviews from recent TravelSansar explorers</p>
          </div>
          
          <div className="experiences-testimonials-grid">
            {[
              {
                id: 1,
                name: "Sarah Johnson",
                location: "New York, USA",
                quote: "The Himalayan Trek was life-changing! Our guide was incredibly knowledgeable and the scenery was breathtaking. TravelSansar handled everything perfectly.",
                image: "https://via.placeholder.com/80",
                rating: 5,
                experience: "Himalayan Trek & Mountain Expedition"
              },
              {
                id: 2,
                name: "David Chen",
                location: "Melbourne, Australia",
                quote: "The cultural immersion in Bali exceeded all expectations. We participated in ceremonies that tourists typically don't see and made connections with local artisans.",
                image: "https://via.placeholder.com/80",
                rating: 5,
                experience: "Traditional Festival & Artisan Workshop Tour"
              },
              {
                id: 3,
                name: "Priya Patel",
                location: "London, UK",
                quote: "The beachfront retreat was exactly what I needed. The yoga instructors were world-class and the private villa accommodations were stunning.",
                image: "https://via.placeholder.com/80",
                rating: 4,
                experience: "Beachfront Wellness & Yoga Retreat"
              }
            ].map(testimonial => (
              <div key={testimonial.id} className="experiences-testimonial-card">
                <div className="experiences-testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={`experiences-icon ${i < testimonial.rating ? 'filled' : ''}`} 
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="experiences-testimonial-quote">"{testimonial.quote}"</p>
                <div className="experiences-testimonial-footer">
                  <img 
                    src={testimonial.image} 
                    alt="images of experience"
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
            <Link 
              to="/reviews" 
              className="experiences-secondary-button" 
              aria-label="Read all customer reviews"
            >
              Read All Reviews
            </Link>
          </div>
        </div>
      </section>

      <section className="experiences-cta-section">
        <div className="experiences-container">
          <div className="experiences-cta-content">
            <h2 className="experiences-cta-title">Ready to Start Your Journey?</h2>
            <p className="experiences-cta-text">
              Join thousands of travelers who have trusted TravelSansar for their most memorable experiences
            </p>
            <div className="experiences-cta-buttons">
              <Link 
                to="/tours" 
                className="experiences-primary-button" 
                aria-label="Browse all experiences"
              >
                Browse Experiences
              </Link>
              <Link 
                to="/custom" 
                className="experiences-secondary-button" 
                aria-label="Create a custom trip"
              >
                Create Custom Trip
              </Link>
            </div>
            <div className="experiences-cta-guarantee">
              <img 
                src="https://via.placeholder.com/24" 
                alt="Satisfaction guarantee icon" 
                className="experiences-guarantee-icon" 
              />
              <p>100% Satisfaction Guarantee | Flexible Booking & Free Cancellation Policy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="experiences-newsletter-section">
        <div className="experiences-container">
          <div className="experiences-newsletter-content">
            <h2 className="experiences-newsletter-title">Get Exclusive Travel Offers</h2>
            <p className="experiences-newsletter-text">
              Subscribe to our newsletter for early access to new experiences and special promotions
            </p>
            <div className="experiences-newsletter-form">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="experiences-newsletter-input" 
                aria-label="Enter your email address for newsletter"
                required 
              />
              <button 
                onClick={handleNewsletterSubscribe} 
                className="experiences-newsletter-button"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </div>
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