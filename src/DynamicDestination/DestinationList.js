import React from 'react';
import DestinationCard from './DestinationCard';

function DestinationList({ destinations, onEdit, onDelete }) {
  return (
    <div className="destinations-grid">
      {destinations.map(destination => (
        <DestinationCard 
          key={destination._id} 
          destination={destination} 
          onEdit={() => onEdit(destination)}
          onDelete={() => onDelete(destination._id)}
        />
      ))}
    </div>
  );
}

export default DestinationList;