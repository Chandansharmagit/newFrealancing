import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab, fetchAllToursAndUsers, fetchTourData }) => {
  return (
    <div className="tracking-tabs">
      <button
        className={activeTab === 'user' ? 'active' : ''}
        onClick={() => setActiveTab('user')}
        aria-label="User Tracking Tab"
      >
        User Tracking
      </button>
      <button
        className={activeTab === 'tour' ? 'active' : ''}
        onClick={() => setActiveTab('tour')}
        aria-label="Tour Tracking Tab"
      >
        Tour Tracking
      </button>
      <button
        className={activeTab === 'combined' ? 'active' : ''}
        onClick={() => setActiveTab('combined')}
        aria-label="Combined Filter Tab"
      >
        Combined Filter
      </button>
      <button
        className={activeTab === 'all' ? 'active' : ''}
        onClick={() => {
          setActiveTab('all');
          fetchAllToursAndUsers();
        }}
        aria-label="All Tours and Users Tab"
      >
        All Tours & Users
      </button>
      <button
        className={activeTab === 'findTour' ? 'active' : ''}
        onClick={() => setActiveTab('findTour')}
        aria-label="Find by Tour ID Tab"
      >
        Find by Tour ID
      </button>
    </div>
  );
};

export default TabNavigation;