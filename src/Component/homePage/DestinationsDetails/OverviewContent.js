import React from 'react';

const OverviewContent = ({ destination }) => {
  return (
    <div className="overview-content" id="overview-panel" role="tabpanel" aria-labelledby="overview-tab">
      <div className="overview-description">
        {destination.description && (
          <div className="description-block">
            <h2 className="content-title">About {destination.title}</h2>
            <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: destination.description }} />
          </div>
        )}
        
        {destination.highlights && destination.highlights.length > 0 && (
          <div className="highlights-block">
            <h2 className="content-title">Highlights</h2>
            <ul className="highlights-list">
              {destination.highlights.map((highlight, index) => (
                <li key={index} className="highlight-item">{highlight}</li>
              ))}
            </ul>
          </div>
        )}
        
        {destination.bestTimeToVisit && (
          <div className="best-time-block">
            <h2 className="content-title">Best Time to Visit</h2>
            <p>{destination.bestTimeToVisit}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewContent; 