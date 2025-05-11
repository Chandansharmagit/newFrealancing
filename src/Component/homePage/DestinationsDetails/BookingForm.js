import React, { useState } from 'react';
import axios from 'axios';
import './BookingForm.css';
import { useParams } from 'react-router-dom';

const BookingForm = ({ destination, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travelers: 1,
    startDate: '',
    endDate: '',
    accommodation: 'hotel',
    specialRequirements: ''
  });
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(`https://backendtravelagencytwomicroservice.onrender.com/api/bookings/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        alert('Booking details submitted! We will contact you shortly.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          travelers: 1,
          startDate: '',
          endDate: '',
          accommodation: 'hotel',
          specialRequirements: ''
        });
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit booking. Please try again.');
      console.error('Booking submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-modal-overlay" onClick={(e) => e.target.className === 'booking-modal-overlay' && onClose()}>
      <div className="booking-modal">
        <button className="close-button" onClick={onClose} aria-label="Close booking form">×</button>
        
        <h2>Book Your Trip to {destination}</h2>
        <p className="booking-subtitle">Destination ID: {id}</p>
        
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (123) 456-7890"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="travelers">Number of Travelers</label>
              <input
                type="number"
                id="travelers"
                name="travelers"
                min="1"
                value={formData.travelers}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="accommodation">Accommodation Type</label>
              <select
                id="accommodation"
                name="accommodation"
                value={formData.accommodation}
                onChange={handleChange}
              >
                <option value="hotel">Hotel</option>
                <option value="hostel">Hostel</option>
                <option value="apartment">Apartment</option>
                <option value="resort">Resort</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="specialRequirements">Special Requirements</label>
            <textarea
              id="specialRequirements"
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleChange}
              placeholder="Any special requests or requirements for your trip"
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Book Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;