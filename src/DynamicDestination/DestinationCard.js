import React from 'react';
import MediaPreview from './MediaPreview';
import './DestinationCard.css';

function DestinationCard({ destination, onEdit, onDelete }) {
  const handleEdit = () => {
    onEdit(destination);
  };

  const handleDelete = () => {
    onDelete(destination._id);
  };

  return (
    <div className="dstcrd-container-x7q9">
      <div className="dstcrd-media-z3k2">
        {destination.images && destination.images.length > 0 ? (
          <MediaPreview media={destination.images[0]} />
        ) : (
          <div className="dstcrd-noimage-p8m4">No Image Available</div>
        )}
      </div>
      
      <div className="dstcrd-content-w2r5">
        <div className="dstcrd-title-y6t3">{destination.title}</div>
        <div className="dstcrd-location-j9n1">{destination.location}</div>
        <div className="dstcrd-description-k4r8">{destination.description}</div>
        <div className="dstcrd-meta-q3x7">
          <div className="dstcrd-meta-item-m5p2">
            <strong>Best Time:</strong> {destination.bestTimeToVisit}
          </div>
          <div className="dstcrd-meta-item-m5p2">
            <strong>Media:</strong> {destination.images.length} images, {destination.videos.length} videos
          </div>
        </div>
        <div className="dstcrd-actions-t8h6">
          <button 
            className="dstcrd-btn-edit-f2r9" 
            onClick={handleEdit}
          >
            Edit
          </button>
          <button 
            className="dstcrd-btn-delete-n7y4" 
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DestinationCard;