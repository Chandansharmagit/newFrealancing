import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import './CreateTourPage.css';

const CreateTourPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    itinerary: [],
    inclusions: [],
    availableDates: []
  });
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [previews, setPreviews] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    maxFiles: 100,
    onDrop: (acceptedFiles) => {
      const invalidFiles = acceptedFiles.filter(file => !['image/jpeg', 'image/png', 'image/gif'].includes(file.type));
      if (invalidFiles.length > 0) {
        setError(
          `Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}. ` +
          `Only JPEG, PNG, and GIF images are allowed.`
        );
        return;
      }

      if (acceptedFiles.length + images.length > 100) {
        setError('You can upload a maximum of 100 images');
        return;
      }

      const newPreviews = acceptedFiles.map(file => ({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file)
      }));

      setImages([...images, ...acceptedFiles]);
      setPreviews([...previews, ...newPreviews]);
      setError(null);
    }
  });

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index].url);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddItineraryDay = () => {
    setFormData({
      ...formData,
      itinerary: [
        ...formData.itinerary,
        { day: formData.itinerary.length + 1, location: '', activities: '', meals: '' }
      ]
    });
  };

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index][field] = value;
    setFormData({
      ...formData,
      itinerary: newItinerary
    });
  };

  const moveItineraryDay = (index, direction) => {
    const newItinerary = [...formData.itinerary];
    if (direction === 'up' && index > 0) {
      [newItinerary[index], newItinerary[index - 1]] = [newItinerary[index - 1], newItinerary[index]];
    } else if (direction === 'down' && index < newItinerary.length - 1) {
      [newItinerary[index], newItinerary[index + 1]] = [newItinerary[index + 1], newItinerary[index]];
    }

    // Update day numbers
    newItinerary.forEach((item, i) => {
      item.day = i + 1;
    });

    setFormData({
      ...formData,
      itinerary: newItinerary
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.name || !formData.description || !formData.duration || !formData.price) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    if (images.length === 0) {
      setError('Please upload at least one image');
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('itinerary', JSON.stringify(formData.itinerary));
      formDataToSend.append('inclusions', JSON.stringify(formData.inclusions));
      formDataToSend.append('availableDates', JSON.stringify(formData.availableDates));

      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await fetch('http://localhost:5000/api/tours', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (errorData.details && errorData.details.fileName) {
          throw new Error(
            `Invalid file type: ${errorData.details.fileName}. ` +
            `Allowed types: ${errorData.details.allowedTypes.join(', ')}`
          );
        }
        
        throw new Error(errorData.message || 'Failed to create tour');
      }

      const result = await response.json();
      navigate(`/tours/${result._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-tour-page">
      <button
        onClick={() => navigate('/')}
        className="back-button"
      >
        ← Back to Tours
      </button>
      
      <h1>Create New Tour</h1>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="tour-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Tour Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Duration *</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Inclusions (comma separated)</label>
            <input
              type="text"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  inclusions: e.target.value.split(',').map(item => item.trim())
                });
              }}
            />
          </div>

          <div className="form-group full-width">
            <label>Available Dates (comma separated, YYYY-MM-DD)</label>
            <input
              type="text"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  availableDates: e.target.value.split(',').map(date => date.trim())
                });
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Tour Images *</label>
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the images here...</p>
            ) : (
              <p>Drag & drop images here, or click to select (JPEG, PNG, GIF only)</p>
            )}
          </div>
          {previews.length > 0 && (
            <div className="image-previews">
              <p>Selected Images ({previews.length}/100):</p>
              <div className="preview-grid">
                {previews.map((preview, index) => (
                  <div key={index} className="preview-item">
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="preview-image"
                    />
                    <div className="preview-info">
                      <span className="preview-name">{preview.name}</span>
                      <span>{(preview.size / 1024).toFixed(2)} KB</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="itinerary-section">
          <div className="itinerary-header">
            <label>Itinerary</label>
            <button
              type="button"
              onClick={handleAddItineraryDay}
              className="add-day-button"
            >
              Add Day
            </button>
          </div>
          
          <div className="itinerary-list">
            {formData.itinerary.map((day, index) => (
              <div key={index} className="itinerary-day">
                <div className="itinerary-controls">
                  <button
                    type="button"
                    onClick={() => moveItineraryDay(index, 'up')}
                    disabled={index === 0}
                    className="control-button"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItineraryDay(index, 'down')}
                    disabled={index === formData.itinerary.length - 1}
                    className="control-button"
                  >
                    ↓
                  </button>
                </div>
                <h3>Day {day.day}</h3>
                <div className="itinerary-grid">
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Location *"
                      value={day.location}
                      onChange={(e) => handleItineraryChange(index, 'location', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Meals *"
                      value={day.meals}
                      onChange={(e) => handleItineraryChange(index, 'meals', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      placeholder="Activities *"
                      value={day.activities}
                      onChange={(e) => handleItineraryChange(index, 'activities', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Creating...
            </>
          ) : (
            'Create Tour'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateTourPage;