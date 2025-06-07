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

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.message ||
      !formData.termsAccepted
    ) {
      setFormStatus({
        submitted: false,
        error: true,
        message: "Please fill in all required fields and accept the terms.",
      });
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        submitted: false,
        error: true,
        message: "Please enter a valid email address.",
      });
      return false;
    }

    if (formData.departureDate && formData.returnDate) {
      const departure = new Date(formData.departureDate);
      const returnDate = new Date(formData.returnDate);
      if (returnDate < departure) {
        setFormStatus({
          submitted: false,
          error: true,
          message: "Return date must be after departure date.",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setFormStatus({
        submitted: true,
        error: false,
        message: "Submitting...",
      });

      const response = await fetch(
        "https://backendtravelagencytwomicroservice.onrender.com/api/travel/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setFormStatus({
          submitted: true,
          error: false,
          message:
            "Thank you! Your travel request has been received. We'll contact you within 24 hours.",
        });

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
    <div className="ts-contact-page-2025">
      {/* Header Section */}
      <header className="ts-header-section-unique">
        <div className="ts-container-unique">
          <h1 className="ts-main-title-2025">Travel Sansar</h1>
          <p className="ts-main-subtitle-2025">
            Plan your dream vacation with expert guidance
          </p>
        </div>
      </header>

      {/* Trust Badges */}
      <section className="ts-trust-section-2025">
        <div className="ts-container-unique">
          <div className="ts-trust-grid-unique">
            <div className="ts-trust-item-2025">
              <div className="ts-trust-icon-unique">✓</div>
              <h3>100% Satisfaction</h3>
              <p>Over 10,000 happy travelers</p>
            </div>
            <div className="ts-trust-item-2025">
              <div className="ts-trust-icon-unique">24/7</div>
              <h3>24/7 Support</h3>
              <p>We're with you every step</p>
            </div>
            <div className="ts-trust-item-2025">
              <div className="ts-trust-icon-unique">🔒</div>
              <h3>Secure Booking</h3>
              <p>SSL encrypted transactions</p>
            </div>
            <div className="ts-trust-item-2025">
              <div className="ts-trust-icon-unique">$</div>
              <h3>Best Price</h3>
              <p>We match any lower price</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="ts-main-content-2025">
        <div className="ts-container-unique">
          <div className="ts-content-grid-unique">
            {/* Left Column - Company Info */}
            <div className="ts-info-section-2025">
              <div className="ts-info-block-unique">
                <h2>Why Travel Sansar?</h2>
                <p className="ts-company-description-2025">
                  Since 2005, Travel Sansar has crafted unforgettable journeys
                  for adventurers, families, and travelers worldwide. Our expert
                  consultants bring firsthand destination expertise to every
                  trip we plan.
                </p>
              </div>

              {/* Testimonial */}
              <div className="ts-testimonial-unique">
                <p className="ts-quote-2025">
                  "Travel Sansar made our honeymoon perfect! Their personalized
                  service was beyond expectations."
                </p>
                <p className="ts-author-2025">
                  — Michael & Sarah, Caribbean Tour 2024
                </p>
              </div>

              {/* Credentials */}
              <div className="ts-credentials-unique">
                <h3>Our Credentials</h3>
                <div className="ts-credential-badges-2025">
                  <span className="ts-badge-unique">IATA Accredited</span>
                  <span className="ts-badge-unique">ASTA Member</span>
                  <span className="ts-badge-unique">Sustainable Tourism</span>
                </div>
              </div>

              {/* Contact Details */}
              <div className="ts-contact-details-2025">
                <div className="ts-contact-item-unique">
                  <div className="ts-contact-icon-2025">✉</div>
                  <div className="ts-contact-info-unique">
                    <h3>Email Us</h3>
                    <p>travelsansar0@gmail.com</p>
                    <p>info@travelsansr.com</p>
                    <p>support@travelsansr.com</p>
                    <p>madan@travelsansr.com</p>
                    <p className="ts-response-time-2025">
                      Response within 24 hours
                    </p>
                  </div>
                </div>

                <div className="ts-contact-item-unique">
                  <div className="ts-contact-icon-2025">📞</div>
                  <div className="ts-contact-info-unique">
                    <h3>Call Us</h3>
                    <p>+9779855051795</p>
                    <p className="ts-response-time-2025">Sun-Fri: 9am-8pm</p>
                  </div>
                </div>

                <div className="ts-contact-item-unique">
                  <div className="ts-contact-icon-2025">📍</div>
                  <div className="ts-contact-info-unique">
                    <h3>Visit Us</h3>
                    <p>Sahidchowk, Narayanghat, Chitwan</p>
                    <p className="ts-response-time-2025">Mon-Sat, 10am-6pm</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="ts-social-links-2025">
                {/* Replace with actual social media URLs */}
                <a
                  href="https://facebook.com/travelsansar"
                  className="ts-social-link-unique"
                >
                  Facebook
                </a>
                <a
                  href="https://instagram.com/travelsansar"
                  className="ts-social-link-unique"
                >
                  Instagram
                </a>
                <a
                  href="https://twitter.com/travelsansar"
                  className="ts-social-link-unique"
                >
                  Twitter
                </a>
                <a
                  href="https://youtube.com/travelsansar"
                  className="ts-social-link-unique"
                >
                  YouTube
                </a>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="ts-form-section-2025">
              <div className="ts-form-header-unique">
                <h2>Plan Your Journey</h2>
                <p>
                  Share your travel preferences, and our specialists will craft
                  a personalized itinerary just for you.
                </p>
              </div>

              {formStatus.message && (
                <div
                  className={`ts-form-message-unique ${
                    formStatus.error ? "ts-error-unique" : "ts-success-unique"
                  }`}
                >
                  {formStatus.message}
                </div>
              )}

              <div className="ts-contact-form-2025">
                {/* Personal Information */}
                <div className="ts-form-section-block-unique">
                  <h3 className="ts-section-title-2025">
                    Personal Information
                  </h3>

                  <div className="ts-form-group-unique">
                    <label htmlFor="name">
                      Full Name <span className="ts-required-unique">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div className="ts-form-group-unique">
                    <label htmlFor="email">
                      Email Address{" "}
                      <span className="ts-required-unique">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div className="ts-form-group-unique">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (___) ___-____"
                      aria-describedby="phone-description"
                    />
                    <small id="phone-description" className="ts-form-help-text">
                      Optional: Include country code
                    </small>
                  </div>

                  <div className="ts-form-group-unique">
                    <label htmlFor="hearAbout">
                      How did you hear about us?
                    </label>
                    <select
                      id="hearAbout"
                      name="hearAbout"
                      value={formData.hearAbout}
                      onChange={handleChange}
                      aria-describedby="hearAbout-description"
                    >
                      <option value="">Please select</option>
                      {referralSources.map((source, index) => (
                        <option key={index} value={source}>
                          {source}
                        </option>
                      ))}
                    </select>
                    <small
                      id="hearAbout-description"
                      className="ts-form-help-text"
                    >
                      Optional: Help us understand our reach
                    </small>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="ts-form-section-block-unique">
                  <h3 className="ts-section-title-2025">Trip Details</h3>

                  <div className="ts-form-group-unique">
                    <label htmlFor="destination">Interested Destination</label>
                    <select
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      aria-describedby="destination-description"
                    >
                      <option value="">Select a destination</option>
                      {destinations.map((destination, index) => (
                        <option key={index} value={destination}>
                          {destination}
                        </option>
                      ))}
                    </select>
                    <small
                      id="destination-description"
                      className="ts-form-help-text"
                    >
                      Optional: Choose your dream destination
                    </small>
                  </div>

                  <div className="ts-form-group-unique">
                    <label htmlFor="travelType">Type of Travel</label>
                    <select
                      id="travelType"
                      name="travelType"
                      value={formData.travelType}
                      onChange={handleChange}
                      aria-describedby="travelType-description"
                    >
                      <option value="">Select travel type</option>
                      {travelTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <small
                      id="travelType-description"
                      className="ts-form-help-text"
                    >
                      Optional: Select your preferred travel style
                    </small>
                  </div>

                  <div className="ts-form-row-unique">
                    <div className="ts-form-group-unique">
                      <label htmlFor="travelers">Number of Travelers</label>
                      <input
                        type="number"
                        id="travelers"
                        name="travelers"
                        min="1"
                        value={formData.travelers}
                        onChange={handleChange}
                        placeholder="2"
                        aria-describedby="travelers-description"
                      />
                      <small
                        id="travelers-description"
                        className="ts-form-help-text"
                      >
                        Optional: Enter number of travelers
                      </small>
                    </div>

                    <div className="ts-form-group-unique">
                      <label htmlFor="budget">Budget Range</label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        aria-describedby="budget-description"
                      >
                        <option value="">Select budget</option>
                        {budgetRanges.map((range, index) => (
                          <option key={index} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                      <small
                        id="budget-description"
                        className="ts-form-help-text"
                      >
                        Optional: Select your budget range
                      </small>
                    </div>
                  </div>

                  <div className="ts-form-row-unique">
                    <div className="ts-form-group-unique">
                      <label htmlFor="departureDate">Departure Date</label>
                      <input
                        type="date"
                        id="departureDate"
                        name="departureDate"
                        value={formData.departureDate}
                        onChange={handleChange}
                        aria-describedby="departureDate-description"
                      />
                      <small
                        id="departureDate-description"
                        className="ts-form-help-text"
                      >
                        Optional: Select your departure date
                      </small>
                    </div>

                    <div className="ts-form-group-unique">
                      <label htmlFor="returnDate">Return Date</label>
                      <input
                        type="date"
                        id="returnDate"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        aria-describedby="returnDate-description"
                      />
                      <small
                        id="returnDate-description"
                        className="ts-form-help-text"
                      >
                        Optional: Select your return date
                      </small>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="ts-form-section-block-unique">
                  <h3 className="ts-section-title-2025">
                    Additional Information
                  </h3>

                  <div className="ts-form-group-unique">
                    <label htmlFor="message">
                      Your Travel Preferences{" "}
                      <span className="ts-required-unique">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your dream vacation, special requests, or questions."
                      rows="5"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div className="ts-checkbox-group-unique">
                    <input
                      type="checkbox"
                      id="subscribe"
                      name="subscribe"
                      checked={formData.subscribe}
                      onChange={handleChange}
                      aria-describedby="subscribe-description"
                    />
                    <label htmlFor="subscribe">
                      Subscribe to our newsletter for travel tips and offers
                    </label>
                    <small
                      id="subscribe-description"
                      className="ts-form-help-text"
                    >
                      Optional: Receive travel updates
                    </small>
                  </div>

                  <div className="ts-checkbox-group-unique">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      required
                      aria-required="true"
                    />
                    <label htmlFor="termsAccepted">
                      I agree to the{" "}
                      <a href="/terms" className="ts-terms-link-unique">
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="ts-terms-link-unique">
                        Privacy Policy
                      </a>{" "}
                      <span className="ts-required-unique">*</span>
                    </label>
                  </div>
                </div>

                <div className="ts-security-notice-unique">
                  <div className="ts-security-icon-unique">🔒</div>
                  <p>Your information is secure and never shared.</p>
                </div>

                <button
                  type="button"
                  className="ts-submit-button-unique"
                  onClick={handleSubmit}
                  disabled={formStatus.submitted}
                  aria-busy={formStatus.submitted}
                >
                  {formStatus.submitted
                    ? "Sending..."
                    : "Submit Travel Request"}
                </button>
              </div>

              <div className="ts-contact-cta-unique">
                <p>
                  Need help now? Call{" "}
                  <a href="tel:+9779855051795">+9779855051795</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactForm;
