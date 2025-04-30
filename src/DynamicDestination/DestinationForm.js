import React, { useState } from 'react';

import MediaPreview from './MediaPreview';

function DestinationForm({ destination = null, onSuccess, onCancel }) {
  const isEditing = !!destination;
  
  const [formData, setFormData] = useState({
    title: destination?.title || '',
    location: destination?.location || '',
    description: destination?.description || '',
    bestTimeToVisit: destination?.bestTimeToVisit || '',
    thingsToDo: destination?.thingsToDo || '',
  });

  const [images, setImages] = useState(destination?.images || []);
  const [videos, setVideos] = useState(destination?.videos || []);
  const [uploadedFileIds, setUploadedFileIds] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUploaded = (fileInfo, fileId) => {
    setImages(prev => [...prev, fileInfo]);
    setUploadedFileIds(prev => [...prev, fileId]);
  };

  const handleVideoUploaded = (fileInfo, fileId) => {
    setVideos(prev => [...prev, fileInfo]);
    setUploadedFileIds(prev => [...prev, fileId]);
  };

  const handleRemoveMedia = (media) => {
    if (isEditing) {
      // Mark for removal on the server
      setRemovedFiles(prev => [...prev, media.path]);
    }
    
    // Remove from local state
    if (media.path.includes('/images/')) {
      setImages(prev => prev.filter(img => img.path !== media.path));
    } else {
      setVideos(prev => prev.filter(vid => vid.path !== media.path));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        images,
        videos,
        fileIds: uploadedFileIds,
      };

      // Include removed files only when updating
      if (isEditing && removedFiles.length > 0) {
        payload.removedFiles = removedFiles;
      }

      const url = isEditing 
        ? `http://localhost:5000/api/destinations/${destination._id}`
        : 'http://localhost:5000/api/destinations';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess(data.destination);
      } else {
        setError(data.message || 'Failed to save destination');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="destination-form-container">
      <h2>{isEditing ? 'Edit Destination' : 'Add New Destination'}</h2>
      
      <form onSubmit={handleSubmit} className="destination-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bestTimeToVisit">Best Time to Visit</label>
          <input
            type="text"
            id="bestTimeToVisit"
            name="bestTimeToVisit"
            value={formData.bestTimeToVisit}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="thingsToDo">Things to Do</label>
          <textarea
            id="thingsToDo"
            name="thingsToDo"
            value={formData.thingsToDo}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>
{/* 
        <div className="form-group">
          <label>Images</label>
          <div className="media-upload-section">
            <FileUploader onFileUploaded={handleImageUploaded} folder="images" />
            
            <div className="media-preview-grid">
              {images.map((img, index) => (
                <MediaPreview 
                  key={img.path || index} 
                  media={img} 
                  onRemove={handleRemoveMedia} 
                />
              ))}
            </div>
          </div>
        </div> */}

        {/* <div className="form-group">
          <label>Videos</label>
          <div className="media-upload-section">
            <FileUploader onFileUploaded={handleVideoUploaded} folder="videos" />
            
            <div className="media-preview-grid">
              {videos.map((vid, index) => (
                <MediaPreview 
                  key={vid.path || index} 
                  media={vid} 
                  onRemove={handleRemoveMedia} 
                />
              ))}
            </div>
          </div>
        </div> */}

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : isEditing ? 'Update Destination' : 'Create Destination'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DestinationForm;