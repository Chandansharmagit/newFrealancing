import React, { useEffect, useState} from 'react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://backendtravelagencytwomicroservice.onrender.com/api/feedback');
        const result = await response.json();
        if (result.success) {
          // Map API response to match expected structure
          const mappedTestimonials = result.data.map((item) => ({
            id: item._id,
            text: item.message,
            name: item.name,
            location: item.tripDestination,
            image: item.image || '/placeholder-user.jpg',
            rating: item.rating || 5,
          }));
          setTestimonials(mappedTestimonials);
        } else {
          throw new Error('API request unsuccessful');
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Fallback data
        setTestimonials([
          {
            id: '1',
            text: 'An unforgettable journey with amazing support!',
            name: 'John Doe',
            location: 'New York, USA',
            image: '/placeholder-user.jpg',
            rating: 5,
          },
          {
            id: '2',
            text: 'The trip exceeded all my expectations. The guides were knowledgeable and the scenery was breathtaking.',
            name: 'Emma Wilson',
            location: 'London, UK',
            image: '/placeholder-user.jpg',
            rating: 5,
          },
          {
            id: '3',
            text: 'A perfect blend of adventure and relaxation. Will definitely book again!',
            name: 'Michael Chen',
            location: 'Toronto, Canada',
            image: '/placeholder-user.jpg',
            rating: 4,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Generate star ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <section className="ts-testimonials-section">
      <div className="ts-container">
        <div className="ts-section-header">
          <span className="ts-section-badge">Testimonials</span>
          <h2 className="ts-section-title">What Our Travelers Say</h2>
          <p className="ts-section-subtitle">Real experiences from our satisfied customers</p>
        </div>

        {isLoading ? (
          <div className="ts-loading">
            <div className="ts-spinner"></div>
            <p>Loading testimonials...</p>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              el: '.ts-swiper-pagination',
              clickable: true,
            }}
            navigation={{
              nextEl: '.ts-swiper-button-next',
              prevEl: '.ts-swiper-button-prev',
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="ts-swiper-container"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="ts-testimonial-card">
                  <div className="ts-testimonial-quotemark">"</div>
                  <div className="ts-rating">{renderStars(testimonial.rating)}</div>
                  <div className="ts-testimonial-content">
                    <p>{testimonial.text}</p>
                  </div>
                  <div className="ts-testimonial-author">
                    <img
                      src={testimonial.image}
                      alt={`Profile of ${testimonial.name}`}
                      className="ts-author-image"
                      loading="lazy"
                    />
                    <div className="ts-author-info">
                      <h4 className="ts-author-name">{testimonial.name}</h4>
                      <p className="ts-author-location">
                        <span className="ts-location-icon">📍</span> {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        
        <div className="ts-swiper-controls">
          <div className="ts-swiper-pagination"></div>
          <div className="ts-navigation-buttons">
            <div className="ts-swiper-button-prev">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>
            <div className="ts-swiper-button-next">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;