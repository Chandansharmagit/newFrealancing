import React from 'react';

const DestinationTabs = ({ activeTab, setActiveTab, destination }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'things-to-do', label: 'Things to Do' },
    { id: 'map', label: 'Map & Location' },
    { id: 'reviews', label: 'Reviews' }
  ];
  
  // Filter tabs based on available data
  const filteredTabs = tabs.filter(tab => {
    if (tab.id === 'things-to-do' && (!destination.thingsToDo || destination.thingsToDo.length === 0)) {
      return false;
    }
    if (tab.id === 'reviews' && (!destination.reviews || destination.reviews.length === 0)) {
      return false;
    }
    return true;
  });

  return (
    <div className="destination-tabs" role="tablist" aria-label="Destination information">
      {filteredTabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          id={`${tab.id}-tab`}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default DestinationTabs; 