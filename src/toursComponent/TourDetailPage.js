import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Footer from "../Component/homePage/Footer";
import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiStar,
  FiArrowRight,
} from "react-icons/fi";

import { trackWhatsAppRequest } from "./trackWhatsAppRequest";
import { ensureUserId } from "./trackWhatsAppRequest";
import "./TourDetailPage.css";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const TourDetailPage = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // WhatsApp number from environment variable or fallback
  const whatsappNumber =
    process.env.REACT_APP_WHATSAPP_NUMBER || "9845427041";

  // Ensure user has tracking ID when component mounts
  useEffect(() => {
    ensureUserId();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "/images/tour-placeholder.jpg";
    if (image.url && image.url.startsWith("http")) return image.url;
    if (image.url) return `${API_BASE_URL}${image.url}`;
    if (image.originalName)
      return `${API_BASE_URL}/uploads/${image.originalName}`;
    return "/images/tour-placeholder.jpg";
  };

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/tours/${id}`);
        const tourData = response.data.data;

        setTour({
          ...tourData,
          images:
            tourData.images?.map((img) => ({
              ...img,
              url: getImageUrl(img),
            })) || [],
          availableDates: tourData.bookingDetails?.availableDates || [],
          inclusions: tourData.inclusions || [],
          itinerary: tourData.itinerary || [],
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load this adventure. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return "Date not specified";
    }
  };

  // Handle WhatsApp button click with tracking
  const handleWhatsAppClick = async () => {
    // Track the click event
    await trackWhatsAppRequest(id);
    
    // Pre-filled WhatsApp message with tour name and ID
    const whatsappMessage = encodeURIComponent(
      `Hello! I'm interested in the "${tour?.name || "tour"}" tour (ID: ${id}). Can you provide more details about availability and booking?`
    );
    
    // Open WhatsApp in new tab
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading)
    return <div className="tour-loading">Discovering your adventure...</div>;
  if (error) return <div className="tour-error">{error}</div>;
  if (!tour)
    return (
      <div className="tour-not-found">This adventure doesn't exist yet!</div>
    );

  return (
    <>
      <div className="tour-experience">
        {/* Hero Banner with Full-width Image */}
        <div
          className="tour-hero"
          style={{
            backgroundImage: `url(${
              tour.images[0]?.url || "/images/tour-banner.jpg"
            })`,
          }}
        >
          <div className="hero-overlay">
            <div className="hero-content">
              <div className="tour-badge">Adventure Awaits</div>
              <h1>{tour.name}</h1>
              <div className="hero-meta">
                <span>
                  <FiMapPin />{" "}
                  {tour.itinerary[0]?.location || "Multiple Locations"}
                </span>
                <span>
                  <FiClock /> {tour.duration}
                </span>
                <span>
                  <FiUsers /> Small Group
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="tour-container">
          {/* Image Gallery */}
          <section className="tour-gallery">
            <div className="gallery-main">
              <img
                src={
                  tour.images[activeImageIndex]?.url ||
                  "/images/tour-placeholder.jpg"
                }
                alt={tour.name}
                className="active-image"
              />
            </div>
            <div className="gallery-thumbnails">
              {tour.images.map((image, index) => (
                <div
                  key={`thumb-${index}`}
                  className={`thumbnail ${
                    index === activeImageIndex ? "active" : ""
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img
                    src={image.url}
                    alt={`${tour.name} thumbnail ${index}`}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Tour Highlights */}
          <section className="tour-highlights">
            <div className="highlight-card">
              <h2>About This Experience</h2>
              <p>{tour.description}</p>

              <div className="highlight-features">
                <div className="feature">
                  <FiStar className="feature-icon" />
                  <h3>Unique Experience</h3>
                  <p>Carefully crafted itinerary with local insights</p>
                </div>
                <div className="feature">
                  <FiUsers className="feature-icon" />
                  <h3>Small Groups</h3>
                  <p>Maximum 12 travelers for personalized attention</p>
                </div>
                <div className="feature">
                  <FiMapPin className="feature-icon" />
                  <h3>Local Guides</h3>
                  <p>Experts who know the hidden gems</p>
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="booking-sidebar">
              <div className="price-box">
                <span>From</span>
                <div className="price">
                  ${tour.price?.toLocaleString() || "Contact"}
                </div>
                <span>per person</span>
              </div>

              <div className="available-dates">
                <h3>Next Departures:</h3>
                {tour.availableDates.length > 0 ? (
                  <ul>
                    {tour.availableDates.slice(0, 3).map((date, i) => (
                      <li key={`date-${i}`}>
                        <FiCalendar /> {formatDate(date)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Flexible dates available</p>
                )}
              </div>

              {/* WhatsApp Button for Availability - Updated with tracking onClick */}
              <button
                onClick={handleWhatsAppClick}
                className="inquiry-button"
              >
                Check Availability via WhatsApp <FiArrowRight />
              </button>
            </div>
          </section>

          {/* Detailed Itinerary */}
          <section className="tour-itinerary">
            <h2>Journey Itinerary</h2>

            {tour.itinerary.length > 0 ? (
              <div className="itinerary-steps">
                {tour.itinerary.map((day, index) => (
                  <div key={`day-${day.day}`} className="itinerary-day">
                    <div className="day-marker">Day {day.day}</div>
                    <div className="day-content">
                      <h3>{day.location || "Exploring"}</h3>
                      <div className="day-details">
                        <div>
                          <h4>Activities</h4>
                          <p>{day.activities || "Full day of exploration"}</p>
                        </div>
                        <div>
                          <h4>Meals</h4>
                          <p>{day.meals || "Meals not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Detailed itinerary coming soon</p>
            )}
          </section>

          {/* Inclusions */}
          <section className="tour-inclusions">
            <h2>What's Included</h2>
            {tour.inclusions.length > 0 ? (
              <ul className="inclusions-list">
                {tour.inclusions.map((item, index) => (
                  <li key={`inc-${index}`}>
                    <span className="check-mark">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Inclusion details coming soon</p>
            )}
          </section>
        </div>

        {/* Fixed CTA for mobile - Updated with tracking onClick */}
        <div className="mobile-cta">
          <div className="mobile-price">
            From ${tour.price?.toLocaleString() || "..."}
          </div>
          <button
            onClick={handleWhatsAppClick}
            className="mobile-book-button"
          >
            Book via WhatsApp
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TourDetailPage;