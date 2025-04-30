import React from 'react';
import './TestimonialsSection.css';

const TestimonialsSection = ({ testimonials }) => {
  return (
    <section className="ts-testimonials-section">
      <div className="ts-container">
        <div className="ts-section-header">
          <h2 className="ts-section-title">What Our Travelers Say</h2>
          <p className="ts-section-subtitle">Real experiences from our satisfied customers</p>
        </div>

        <div className="ts-testimonials-grid">
          {testimonials.map((testimonial) => (
            <div className="ts-testimonial-card" key={testimonial.id}>
              <div className="ts-testimonial-content">
                <p>{testimonial.text}</p>
              </div>
              <div className="ts-testimonial-author">
                <img
                  src={testimonial.image || '/placeholder-user.jpg'}
                  alt={`Profile of ${testimonial.name}`}
                  className="ts-author-image"
                  loading="lazy"
                  sizes="(max-width: 600px) 60px, 80px"
                />
                <div className="ts-author-info">
                  <h4 className="ts-author-name">{testimonial.name}</h4>
                  <p className="ts-author-location">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;