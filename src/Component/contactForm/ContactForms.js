import React, { useState } from "react";
import "./ContactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    travelType: "",
    budget: "",
    travelers: "",
    departureDate: "",
    returnDate: "",
    message: "",
    hearAbout: "",
    subscribe: false,
    termsAccepted: false,
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: "",
  });

  const destinations = [
    "Europe",
    "Asia",
    "North America",
    "South America",
    "Africa",
    "Australia",
    "Antarctica",
    "Caribbean",
    "Middle East",
    "Pacific Islands",
  ];

  const travelTypes = [
    "Beach Vacation",
    "Adventure Trip",
    "Cultural Experience",
    "City Break",
    "Luxury Retreat",
    "Family Holiday",
    "Honeymoon",
    "Group Tour",
    "Business Trip",
    "Custom Itinerary",
  ];

  const budgetRanges = [
    "Economy ($1,000 - $3,000)",
    "Standard ($3,000 - $5,000)",
    "Premium ($5,000 - $10,000)",
    "Luxury ($10,000+)",
  ];

  const referralSources = [
    "Search Engine",
    "Social Media",
    "Friend or Family",
    "Travel Magazine",
    "Travel Blog",
    "TV Advertisement",
    "Email Newsletter",
    "Travel Expo",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.message ||
      !formData.termsAccepted
    ) {
      setFormStatus({
        submitted: false,
        error: true,
        message:
          "Please fill in all required fields and accept the terms and conditions.",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        submitted: false,
        error: true,
        message: "Please enter a valid email address.",
      });
      return;
    }

    try {
      setFormStatus({
        submitted: false,
        error: false,
        message: "Submitting...",
      });

      const response = await fetch("https://backendtravelagencytwomicroservice.onrender.com/api/travel/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus({
          submitted: true,
          error: false,
          message:
            "Thank you for contacting us! Your travel request has been received. One of our travel experts will get back to you within 24 hours.",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          destination: "",
          travelType: "",
          budget: "",
          travelers: "",
          departureDate: "",
          returnDate: "",
          message: "",
          hearAbout: "",
          subscribe: false,
          termsAccepted: false,
        });

        // Clear success message after 8 seconds
        setTimeout(() => {
          setFormStatus({
            submitted: false,
            error: false,
            message: "",
          });
        }, 8000);
      } else {
        const errorData = await response.json();
        setFormStatus({
          submitted: false,
          error: true,
          message: errorData.message || "Failed to submit request.",
        });
      }
    } catch (err) {
      setFormStatus({
        submitted: false,
        error: true,
        message: "Error: " + err.message,
      });
    }
  };

  return (
    <>
      <section className="twcf-contact-section">
        <div className="twcf-background-split">
          <div className="twcf-white-half"></div>
          <div
            className="twcf-image-half"
            style={{
              backgroundImage: `url('https://img.freepik.com/free-vector/colorful-abstract-background_23-2148466263.jpg')`,
            }}
          ></div>
        </div>
        <div className="twcf-section-header">
          <h2>Connect with Our Travel Experts</h2>
          <p className="twcf-section-subheading">
            Plan your dream vacation with us today
          </p>
        </div>

        <div className="twcf-trust-badges">
          <div className="twcf-trust-badge">
            <div className="twcf-badge-icon twcf-satisfaction"></div>
            <h3>100% Satisfaction</h3>
            <p>Over 10,000 happy travelers</p>
          </div>
          <div className="twcf-trust-badge">
            <div className="twcf-badge-icon twcf-support"></div>
            <h3>24/7 Support</h3>
            <p>We're with you every step</p>
          </div>
          <div className="twcf-trust-badge">
            <div className="twcf-badge-icon twcf-secure"></div>
            <h3>Secure Booking</h3>
            <p>SSL encrypted transactions</p>
          </div>
          <div className="twcf-trust-badge">
            <div className="twcf-badge-icon twcf-best-price"></div>
            <h3>Best Price Guarantee</h3>
            <p>We match any lower price</p>
          </div>
        </div>

        <div className="twcf-contact-container">
          <div className="twcf-contact-info">
            <h2>Why Travel Sansar?</h2>
            <p className="twcf-company-description">
              Since 2005, Travel Sansar has crafted unforgettable journeys for
              adventurers, families, and travelers worldwide. Our expert
              consultants bring firsthand destination expertise.
            </p>

            <div className="twcf-testimonial">
              <div className="twcf-quote-icon"></div>
              <p className="twcf-quote-text">
                "Travel Sansar made our honeymoon perfect! Their personalized
                service was beyond expectations."
              </p>
              <p className="twcf-quote-author">
                — Michael & Sarah, Caribbean Tour 2024
              </p>
            </div>

            <div className="twcf-credentials">
              <h3>Our Credentials</h3>
              <div className="twcf-credential-badges">
                <div className="twcf-credential-badge twcf-iata">
                  IATA Accredited
                </div>
                <div className="twcf-credential-badge twcf-asta">
                  ASTA Member
                </div>
                <div className="twcf-credential-badge twcf-sustainable">
                  Sustainable Tourism
                </div>
              </div>
            </div>

            <div className="twcf-contact-details">
              <div className="twcf-contact-item">
                <div className="twcf-contact-icon twcf-email-icon"></div>
                <div>
                  <h3>Email Us</h3>
                  <p>travelsansar0@gmail.com</p>
                  <p>info@travelsansr.com</p>
                  <p className="twcf-response-time">Response within 24 hours</p>
                </div>
              </div>

              <div className="twcf-contact-item">
                <div className="twcf-contact-icon twcf-phone-icon"></div>
                <div>
                  <h3>Call Us</h3>
                  <p>+9779855051795</p>
                  <p className="twcf-response-time">Sun-Fri: 9am-8pm</p>
                </div>
              </div>

              <div className="twcf-contact-item">
                <div className="twcf-contact-icon twcf-location-icon"></div>
                <div>
                  <h3>Visit Us</h3>
                  <p>Sahidchowk,Narayanghat,Chitwan</p>
                  <p className="twcf-response-time">Mon-Sat, 10am-6pm</p>
                </div>
              </div>
            </div>

            <div className="twcf-social-links">
              <a
                href="/"
                className="twcf-social-icon twcf-facebook"
                aria-label="Facebook"
              ></a>
              <a
                href="/"
                className="twcf-social-icon twcf-instagram"
                aria-label="Instagram"
              ></a>
              <a
                href="/"
                className="twcf-social-icon twcf-twitter"
                aria-label="Twitter"
              ></a>
              <a
                href="/"
                className="twcf-social-icon twcf-youtube"
                aria-label="YouTube"
              ></a>
            </div>
            <p className="twcf-attribution">
              Image by <a href="https://www.freepik.com">Freepik</a>
            </p>
          </div>

          <div className="twcf-contact-form-container">
            <h2>Plan Your Journey</h2>
            <p className="twcf-form-intro">
              Share your travel preferences, and our specialists will craft a
              personalized itinerary just for you.
            </p>

            {formStatus.message && (
              <div
                className={`twcf-form-message ${
                  formStatus.error ? "twcf-error" : "twcf-success"
                }`}
              >
                {formStatus.message}
              </div>
            )}

            <div className="twcf-contact-form">
              <div className="twcf-form-section">
                <h3 className="twcf-form-section-title">
                  Personal Information
                </h3>

                <div className="twcf-form-group">
                  <label htmlFor="name">
                    Full Name <span className="twcf-required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="twcf-form-group">
                  <label htmlFor="email">
                    Email Address <span className="twcf-required">*</span>
                  </label>
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

                <div className="twcf-form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (___) ___-____"
                  />
                </div>

                <div className="twcf-form-group">
                  <label htmlFor="hearAbout">How did you hear about us?</label>
                  <select
                    id="hearAbout"
                    name="hearAbout"
                    value={formData.hearAbout}
                    onChange={handleChange}
                  >
                    <option value="">Please select</option>
                    {referralSources.map((source, index) => (
                      <option key={index} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="twcf-form-section">
                <h3 className="twcf-form-section-title">Trip Details</h3>

                <div className="twcf-form-group">
                  <label htmlFor="destination">Interested Destination</label>
                  <select
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                  >
                    <option value="">Select a destination</option>
                    {destinations.map((destination, index) => (
                      <option key={index} value={destination}>
                        {destination}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="twcf-form-group">
                  <label htmlFor="travelType">Type of Travel</label>
                  <select
                    id="travelType"
                    name="travelType"
                    value={formData.travelType}
                    onChange={handleChange}
                  >
                    <option value="">Select travel type</option>
                    {travelTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="twcf-form-row">
                  <div className="twcf-form-group twcf-half">
                    <label htmlFor="travelers">Number of Travelers</label>
                    <input
                      type="number"
                      id="travelers"
                      name="travelers"
                      min="1"
                      value={formData.travelers}
                      onChange={handleChange}
                      placeholder="2"
                    />
                  </div>

                  <div className="twcf-form-group twcf-half">
                    <label htmlFor="budget">Budget Range</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                    >
                      <option value="">Select budget</option>
                      {budgetRanges.map((range, index) => (
                        <option key={index} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="twcf-form-row">
                  <div className="twcf-form-group twcf-half">
                    <label htmlFor="departureDate">Departure Date</label>
                    <input
                      type="date"
                      id="departureDate"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="twcf-form-group twcf-half">
                    <label htmlFor="returnDate">Return Date</label>
                    <input
                      type="date"
                      id="returnDate"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="twcf-form-section">
                <h3 className="twcf-form-section-title">
                  Additional Information
                </h3>

                <div className="twcf-form-group twcf-full-width">
                  <label htmlFor="message">
                    Your Travel Preferences{" "}
                    <span className="twcf-required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your dream vacation, special requests, or questions."
                    rows="5"
                    required
                  />
                </div>

                <div className="twcf-form-group twcf-checkbox-group">
                  <input
                    type="checkbox"
                    id="subscribe"
                    name="subscribe"
                    checked={formData.subscribe}
                    onChange={handleChange}
                  />
                  <label htmlFor="subscribe">
                    Subscribe to our newsletter for travel tips and offers
                  </label>
                </div>

                <div className="twcf-form-group twcf-checkbox-group twcf-terms-group">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="termsAccepted">
                    I agree to the{" "}
                    <a href="/" className="twcf-terms-link">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/" className="twcf-terms-link">
                      Privacy Policy
                    </a>{" "}
                    <span className="twcf-required">*</span>
                  </label>
                </div>
              </div>

              <div className="twcf-data-security-notice">
                <div className="twcf-security-icon"></div>
                <p>Your information is secure and never shared.</p>
              </div>

              <button
                type="button"
                className="twcf-submit-button"
                onClick={handleSubmit}
                disabled={formStatus.submitted}
              >
                {formStatus.submitted ? "Sending..." : "Submit Travel Request"}
              </button>
            </div>

            <div className="twcf-contact-cta">
              <p>
                Need help now? Call{" "}
                <a href="tel:+9779855051795">+9779855051795</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactForm;
