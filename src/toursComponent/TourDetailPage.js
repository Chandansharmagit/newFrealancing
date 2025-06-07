import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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

const API_BASE_URL = "https://backendtravelagencytwomicroservice.onrender.com/";

const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER || "+919855051795";

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("https://authenticationagency.onrender.com/api/check-auth", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
    } catch (error) {
      console.error("Error checking auth:", error.message);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    ensureUserId();
    checkAuth();
  }, [checkAuth]);

  const getImageUrl = (image) => {
    if (!image) return "/images/tour-placeholder.jpg";
    if (image.url && image.url.startsWith("http")) return image.url;
    if (image.url) return `${API_BASE_URL}${image.url}`;
    if (image.originalName)
      return `${API_BASE_URL}/Uploads/${image.originalName}`;
    return "/images/tour-placeholder.jpg";
  };

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}api/tours/${id}`);
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

  // Modified handleWhatsAppClick to include all tour details
  const handleWhatsAppClick = async () => {
    console.log("WhatsApp button clicked, isAuthenticated:", isAuthenticated);
    if (!isAuthenticated) {
      console.log("User not authenticated, navigating to login page");
      navigate("/login");
      return;
    }

    // Track asynchronously
    trackWhatsAppRequest(id).catch((error) =>
      console.error("Tracking failed:", error)
    );

    // Construct detailed WhatsApp message
    const imageUrls = tour.images.map((img) => img.url).join("\n");
    const whatsappMessage = encodeURIComponent(
      `Hello! I'm interested in the "${tour?.name || "Unknown Tour"}" tour. Here are the details:\n` +
      `Tour ID: ${id}\n` +
      `Price: Nrs.${tour?.price?.toLocaleString() || "Contact"}\n` +
      `Images:\n${imageUrls || "No images available"}\n` +
      `Can you provide more details about availability and booking?`
    );

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    try {
      const newWindow = window.open(whatsappUrl, "_blank");
      if (!newWindow) {
        alert("Unable to open WhatsApp. Please ensure pop-ups are enabled or open WhatsApp manually.");
      }
    } catch (error) {
      console.error("Failed to open WhatsApp:", error);
      alert("An error occurred while opening WhatsApp. Please try again.");
    }
  };

  if (loading)
    return <div className="tour-loading">Discovering your adventure...</div>;
  if (error) return <div className="tour-error">{error}</div>;
  if (!tour)
    return (
      <div className="tour-not-found">This adventure doesn't exist yet!</div>
    );

  return (
    // ... Rest of the JSX remains unchanged ...
    <div className="tour-experience">
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
            <h1 classname="tour-name">{tour.name}</h1>
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

      <div className="tour-container">
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

          <div className="booking-sidebar">
            <div className="price-box">
              <span>From</span>
              <div className="price">
                Nrs.{tour.price?.toLocaleString() || "Contact"}
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

            <button
              onClick={() => {
                console.log("Inquiry button clicked");
                handleWhatsAppClick();
              }}
              className="inquiry-button"
            >
              Check Availability via WhatsApp <FiArrowRight />
            </button>
          </div>
        </section>

        <section className="tour-itinerary">
          <h2>Journey Itinerary</h2>
          {tour.itinerary.length > 0 ? (
            <div className="itinerary-steps">
              {tour.itinerary.map((day, index) => (
                <div key={`day-${day.day}`} className="itinerary-day">
                  <div className="day-marker">Day {day.day}</div>
                  <div className="day-content">
                    <h3 className="day-h3">{day.location || "Exploring"}</h3>
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

      <div className="mobile-cta">
        <div className="mobile-price">
          From Nrs.{tour.price?.toLocaleString() || "..."}
        </div>
        <button
          onClick={() => {
            console.log("Mobile book button clicked");
            handleWhatsAppClick();
          }}
          className="mobile-book-button"
        >
          Book via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default TourDetailPage;