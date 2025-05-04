import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import DestinationHeader from "./DestinationHeader";
import MediaGallery from "./MediaGallery";
import DestinationTabs from "./DestinationTabs";
import OverviewContent from "./OverviewContent";
import ThingsToDoContent from "./ThingsToDoContent";
import MapContent from "./MapContent";
import ReviewsContent from "./ReviewsContent";
import DestinationCTA from "./DestinationCTA";
import RelatedDestinations from "./RelatedDestinations";

import "./DestinationDetails.css";
import Footer from "../Footer";

const DestinationDetails = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchDestination = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://backendtravelagency.onrender.com/api/destinations/${id}`,
          { signal }
        );

        if (response.status !== 200) {
          throw new Error(
            `Failed to fetch destination: ${response.status} ${response.statusText}`
          );
        }

        const data = response.data;

        if (data.success) {
          setDestination(data.destination);
        } else {
          throw new Error(data.message || "Failed to fetch destination");
        }
      } catch (err) {
        if (!signal.aborted) {
          console.error("Error fetching destination:", err);
          setError(err.message || "Failed to load destination details");
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchDestination();
    }

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <section className="destination-details-section">
        <div className="destination-container">
          <div className="skeleton-header pulse"></div>
          <div className="skeleton-subheader pulse"></div>
          <div className="skeleton-gallery">
            <div className="skeleton-main-image pulse"></div>
            <div className="skeleton-thumbnails">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="skeleton-thumbnail pulse"></div>
              ))}
            </div>
          </div>
          <div className="skeleton-tabs pulse"></div>
          <div className="skeleton-content">
            <div className="skeleton-paragraph pulse"></div>
            <div className="skeleton-paragraph pulse"></div>
            <div className="skeleton-paragraph pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="destination-details-section">
        <div className="destination-container">
          <div className="error-container" role="alert">
            <svg
              className="error-icon"
              viewBox="0 0 24 24"
              width="40"
              height="40"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              ></circle>
              <line
                x1="12"
                y1="8"
                x2="12"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
              ></line>
              <line
                x1="12"
                y1="16"
                x2="12"
                y2="16"
                stroke="currentColor"
                strokeWidth="2"
              ></line>
            </svg>
            <h2 className="error-title">Failed to Load Destination</h2>
            <p className="error-message">{error}</p>
            <button
              className="btn-retry"
              onClick={() => window.location.reload()}
              aria-label="Retry loading destination"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                className="retry-icon"
              >
                <path
                  fill="currentColor"
                  d="M17.65 6.35C16.2 4.9 14.2 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                />
              </svg>
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!destination) {
    return (
      <section className="destination-details-section">
        <div className="destination-container">
          <div className="no-destination">
            <svg
              className="empty-icon"
              viewBox="0 0 24 24"
              width="48"
              height="48"
            >
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"
              />
            </svg>
            <h2 className="empty-title">Destination Not Found</h2>
            <p className="empty-message">
              We couldn't find the destination you're looking for.
            </p>
            <a href="/destinations" className="btn-back">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Back to All Destinations</span>
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
    <section className="destination-details-section">
      <div className="destination-container">
        <MediaGallery destination={destination} />
        <DestinationHeader
          title={destination.title}
          location={destination.location}
          rating={destination.rating}
          reviews={destination.reviews}
          bestTimeToVisit={destination.bestTimeToVisit}
        />

        <DestinationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          destination={destination}
        />
        <div className="tab-content">
          {activeTab === "overview" && (
            <OverviewContent destination={destination} />
          )}
          {activeTab === "things-to-do" && (
            <ThingsToDoContent destination={destination} />
          )}
          {activeTab === "map" && <MapContent destination={destination} />}
          {activeTab === "reviews" && (
            <ReviewsContent destination={destination} />
          )}
        </div>
        <DestinationCTA title={destination.title} />
        {destination.relatedDestinations &&
          destination.relatedDestinations.length > 0 && (
            <RelatedDestinations
              relatedDestinations={destination.relatedDestinations}
            />
          )}
      </div>
    </section>
    <Footer/>
    </>
  );
};

export default DestinationDetails;