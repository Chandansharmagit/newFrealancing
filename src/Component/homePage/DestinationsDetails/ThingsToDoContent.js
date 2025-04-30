import React from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';

const ThingsToDoContent = ({ destination }) => {
  const thingsToDo = destination.thingsToDo || [];
  
  if (!thingsToDo.length) {
    return (
      <div className="things-to-do-content" id="things-to-do-panel" role="tabpanel" aria-labelledby="things-to-do-tab">
        <p className="empty-message">No activities information available for this destination.</p>
      </div>
    );
  }
  
  return (
    <div className="things-to-do-content" id="things-to-do-panel" role="tabpanel" aria-labelledby="things-to-do-tab">
      <h2 className="content-title">Things to Do in {destination.title}</h2>
      
      <div className="activities-grid">
        {Array.isArray(thingsToDo) ? (
          thingsToDo.map((activity, index) => (
            <div className="activity-card" key={index}>
              {activity.image && (
                <div className="activity-image">
                  <img src={activity.image} alt={activity.title} loading="lazy" />
                </div>
              )}
              <div className="activity-content">
                <h3 className="activity-title">{activity.title}</h3>
                {activity.description && <p className="activity-description">{activity.description}</p>}
              </div>
            </div>
          ))
        ) : (
          <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: thingsToDo }} />
        )}
      </div>
      
      {destination.activities && destination.activities.length > 0 && (
        <div className="quick-activities">
          <h3 className="section-subtitle">Popular Activities</h3>
          <ul className="activities-list">
            {destination.activities.map((activity, index) => (
              <li key={index} className="activity-item">
                <IoCheckmarkCircle className="activity-icon" />
                <span>{activity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ThingsToDoContent; 