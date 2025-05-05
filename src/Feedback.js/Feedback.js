import React, { useState } from 'react';
import './FeedbackPopup.css';

const FeedbackPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tripDestination: '',
    rating: 0,
    feedbackType: '',
    message: '',
    subscribe: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(''); // Clear error on input change
  };

  const handleRatingClick = (rating) => {
    setFormData((prevData) => ({
      ...prevData,
      rating,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (formData.tripDestination === 'Please select') {
      setError('Please select a valid trip destination.');
      return;
    }
    if (!formData.feedbackType) {
      setError('Please select a feedback type.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://backendtravelagencytwomicroservice.onrender.com/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit feedback');
      }

      setLoading(false);
      setSubmitted(true);

      // Reset form and close popup after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          tripDestination: '',
          rating: 0,
          feedbackType: '',
          message: '',
          subscribe: false,
        });
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'An error occurred while submitting your feedback.');
    }
  };

  const openPopup = () => {
    setIsOpen(true);
    setError('');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
  };

  const closePopup = () => {
    setIsOpen(false);
    setError('');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  const feedbackTypes = [
    'General Experience',
    'Customer Service',
    'Booking Process',
    'Website Experience',
    'Travel Experience',
    'Tour Guide',
  ];

  const destinations = [
    'Please select',
    'Bali',
    'Paris',
    'Tokyo',
    'New York',
    'Dubai',
    'Maldives',
    'Other',
  ];

  const renderStars = () => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${formData.rating >= star ? 'active' : ''}`}
            onClick={() => handleRatingClick(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Feedback Button */}
      <button className="feedback-button" onClick={openPopup}>
        <span className="feedback-icon">💬</span>
        <span className="feedback-text">Feedback</span>
      </button>

      {/* Feedback Popup */}
      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button className="close-button" onClick={closePopup}>
              ×
            </button>

            {submitted ? (
              <div className="feedback-form success-message">
                <div className="success-icon">✓</div>
                <h2>Thank You!</h2>
                <p>Your feedback has been submitted successfully.</p>
                <p>We appreciate your time and input.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="feedback-form">
                <h2>Share Your Travel Experience</h2>
                <p className="subtitle">We value your feedback to improve our services</p>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
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
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tripDestination">Trip Destination</label>
                  <select
                    id="tripDestination"
                    name="tripDestination"
                    value={formData.tripDestination}
                    onChange={handleChange}
                    required
                  >
                    {destinations.map((destination) => (
                      <option key={destination} value={destination}>
                        {destination}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>How would you rate your overall experience?</label>
                  {renderStars()}
                </div>

                <div className="form-group">
                  <label htmlFor="feedbackType">What aspect are you providing feedback on?</label>
                  <select
                    id="feedbackType"
                    name="feedbackType"
                    value={formData.feedbackType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Please select</option>
                    {feedbackTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Feedback</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please share your experience, suggestions, or concerns..."
                    rows="5"
                    required
                  ></textarea>
                </div>

                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="subscribe"
                    name="subscribe"
                    checked={formData.subscribe}
                    onChange={handleChange}
                  />
                  <label htmlFor="subscribe">
                    Subscribe to receive exclusive travel deals and offers
                  </label>
                </div>

                <button
                  type="submit"
                  className={`submit-button ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackPopup;