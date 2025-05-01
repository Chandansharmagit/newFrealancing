import React from 'react';

function MediaPreview({ media, onRemove = null }) {
  const isVideo = media.path && (media.path.endsWith('.mp4') || media.path.endsWith('.webm') || media.path.endsWith('.mov'));
  const serverUrl = 'https://backendtravelagency.onrender.com/';
  const mediaUrl = media.path.startsWith('http') ? media.path : `${serverUrl}${media.path}`;

  return (
    <div className="media-preview">
      {isVideo ? (
        <video controls width="100%" height="auto">
          <source src={mediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img src={mediaUrl} alt={media.originalname || 'Preview'} />
      )}
      
      {onRemove && (
        <button 
          className="remove-media-btn" 
          onClick={() => onRemove(media)}
          title="Remove"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default MediaPreview;