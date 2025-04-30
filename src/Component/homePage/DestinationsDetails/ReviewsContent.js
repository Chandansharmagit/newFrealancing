import React, { useState } from 'react';
// import './ReviewsContent.css';

const ReviewsContent = ({ destination }) => {
  const reviews = destination?.reviews || [];
  const [visibleReviews, setVisibleReviews] = useState(3);
  
  // Calculate average ratings
  const getAverageRating = (category) => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.ratings?.[category] || 0), 0);
    return (sum / reviews.length).toFixed(1);
  };

  const overallRating = destination?.rating || 0;
  const ratings = {
    cleanliness: getAverageRating('cleanliness') || 9.2,
    service: getAverageRating('service') || 9.0,
    amenities: getAverageRating('amenities') || 9.2,
    comfort: getAverageRating('comfort') || 9.2,
    location: getAverageRating('location') || 10
  };

  const handleLoadMore = () => {
    setVisibleReviews(prev => prev + 5);
  };

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">Guest reviews</h2>
      
      <div className="reviews-overview">
        <div className="ratings-summary">
          {Object.entries(ratings).map(([category, score]) => (
            <div className="rating-item" key={category}>
              <div className="rating-label">{category.charAt(0).toUpperCase() + category.slice(1)}</div>
              <div className="rating-bar-container">
                <div 
                  className="rating-bar" 
                  style={{ width: `${(score / 10) * 100}%` }}
                ></div>
              </div>
              <div className="rating-score">{score}</div>
            </div>
          ))}
        </div>
        
        <div className="overall-rating">
          <div className="rating-score-large">{overallRating.toFixed(1)}</div>
          <div className="rating-label">Excellent · {reviews.length || 490} Reviews</div>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.slice(0, visibleReviews).map((review, index) => (
          <div className="review-card" key={index}>
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-name">{review.name || "Nicholas James"}</div>
                <div className="review-date">{review.date || "Dec 22, 2024"} · {index === 0 ? "Latest Review" : ""}</div>
              </div>
              <div className="review-rating">
                <span className="rating-number">{review.rating || 10}</span>
                <span className="rating-text">Excellent</span>
              </div>
            </div>
            <div className="review-content">
              {review.content || "Hotel is at a nice location with white sandy beach at the doorstep. Both children's and the main pool are very clean and kudos to the staff at the pool. Food and drinks are reasonably priced. We had a great time at the hotel."}
            </div>
          </div>
        ))}
      </div>
      
      {visibleReviews < reviews.length && (
        <button className="read-all-button" onClick={handleLoadMore}>
          Read all reviews
        </button>
      )}
    </div>
  );
};

export default ReviewsContent; 