import React, { useState, useEffect } from 'react';

function DestinationForm({ destination = null, onSuccess, onCancel }) {
  const isEditing = !!destination;

  // Initialize state and sync with destination prop
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

  // Sync state with destination prop changes
  useEffect(() => {
    if (destination) {
      setFormData({
        title: destination.title || '',
        location: destination.location || '',
        description: destination.description || '',
        bestTimeToVisit: destination.bestTimeToVisit || '',
        thingsToDo: destination.thingsToDo || '',
      });
      setImages(destination.images || []);
      setVideos(destination.videos || []);
    }
  }, [destination]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUploaded = (fileInfo, fileId) => {
    if (fileInfo?.path) {
      setImages((prev) => [...prev, fileInfo]);
      setUploadedFileIds((prev) => [...prev, fileId]);
    }
  };

  // Handle video upload
  const handleVideoUploaded = (fileInfo, fileId) => {
    if (fileInfo?.path) {
      setVideos((prev) => [...prev, fileInfo]);
      setUploadedFileIds((prev) => [...prev, fileId]);
    }
  };

  // Handle media removal
  const handleRemoveMedia = (media) => {
    if (!media?.path) return; // Guard against malformed media
    if (isEditing) {
      setRemovedFiles((prev) => [...prev, media.path]);
    }
    if (media.path.includes('/images/')) {
      setImages((prev) => prev.filter((img) => img.path !== media.path));
    } else if (media.path.includes('/videos/')) {
      setVideos((prev) => prev.filter((vid) => vid.path !== media.path));
    }
  };

  // Handle file input change for images and videos
  const handleFileChange = async (e, type) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        // Simulate file upload to server (replace with actual API call)
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`https://backendtravelagency.onrender.com/api/upload/${type}`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.success && data.fileInfo && data.fileId) {
          if (type === 'image') {
            handleImageUploaded(data.fileInfo, data.fileId);
          } else {
            handleVideoUploaded(data.fileInfo, data.fileId);
          }
        } else {
          setError('Failed to upload file');
        }
      } catch (err) {
        setError('Error uploading file');
        console.error(err);
      }
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

      if (isEditing && removedFiles.length > 0) {
        payload.removedFiles = removedFiles;
      }

      const url = isEditing
        ? `https://backendtravelagency.onrender.com/api/destinations/${destination?._id || ''}`
        : 'https://backendtravelagency.onrender.com/api/destinations';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.destination) {
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
            aria-invalid={!!error}
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
            aria-invalid={!!error}
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
            aria-invalid={!!error}
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
            aria-invalid={!!error}
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
            aria-invalid={!!error}
          />
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label htmlFor="images">Upload Images</label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, 'image')}
            disabled={submitting}
          />
          <div className="media-preview">
            {images.map((img, index) => (
              <div key={index} className="media-item">
                <img src={img.path} alt={`Preview ${index}`} width="100" />
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(img)}
                  disabled={submitting}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Video Upload */}
        <div className="form-group">
          <label htmlFor="videos">Upload Videos</label>
          <input
            type="file"
            id="videos"
            accept="video/*"
            multiple
            onChange={(e) => handleFileChange(e, 'video')}
            disabled={submitting}
          />
          <div className="media-preview">
            {videos.map((vid, index) => (
              <div key={index} className="media-item">
                <video src={vid.path} width="100" controls />
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(vid)}
                  disabled={submitting}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={submitting}
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            aria-label={isEditing ? 'Update Destination' : 'Create Destination'}
          >
            {submitting
              ? 'Saving...'
              : isEditing
              ? 'Update Destination'
              : 'Create Destination'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DestinationForm;