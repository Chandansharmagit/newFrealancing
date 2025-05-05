import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import './TourDashboardPage.css';

const TourDashboardPage = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
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
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
          `Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}. Only JPEG, PNG, and GIF images are allowed.`
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

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('https://backendtravelagencytwomicroservice.onrender.com/api/tours');
        if (!response.ok) throw new Error('Failed to fetch tours');
        const data = await response.json();
        setTours(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchTours();
  }, []);

  const handleSelectTour = (tour) => {
    setSelectedTour(tour);
    setFormData({
      name: tour.name || '',
      description: tour.description || '',
      duration: tour.duration || '',
      price: tour.price || '',
      itinerary: tour.itinerary || [],
      inclusions: tour.inclusions || [],
      availableDates: tour.availableDates || []
    });
    setPreviews(tour.images || []);
    setImages([]);
    setError(null);
  };

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

    newItinerary.forEach((item, i) => {
      item.day = i + 1;
    });

    setFormData({
      ...formData,
      itinerary: newItinerary
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.name || !formData.description || !formData.duration || !formData.price) {
      setError('Please fill in all required fields');
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

      const response = await fetch(`https://backendtravelagencytwomicroservice.onrender.com/api/tours/${selectedTour._id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update tour');
      }

      const updatedTour = await response.json();
      setTours(tours.map(tour => tour._id === updatedTour._id ? updatedTour : tour));
      setSelectedTour(null);
      setFormData({
        name: '',
        description: '',
        duration: '',
        price: '',
        itinerary: [],
        inclusions: [],
        availableDates: []
      });
      setImages([]);
      setPreviews([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (tourId) => {
    if (!window.confirm('Are you sure you want to delete this tour?')) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`https://backendtravelagencytwomicroservice.onrender.com/api/tours/delete/${tourId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete tour');
      setTours(tours.filter(tour => tour._id !== tourId));
      if (selectedTour && selectedTour._id === tourId) {
        setSelectedTour(null);
        setFormData({
          name: '',
          description: '',
          duration: '',
          price: '',
          itinerary: [],
          inclusions: [],
          availableDates: []
        });
        setImages([]);
        setPreviews([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className={`tour-dashboard-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
        <button onClick={toggleDarkMode} className="mode-toggle">
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <h1 className='tours'>Tour Dashboard</h1>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="tours-list">
        <h2 className='tours2'>All Tours</h2>
        {tours.length === 0 ? (
          <p>No tours available.</p>
        ) : (
          <div className="tours-grid">
            {tours.map(tour => (
              <div key={tour._id} className="tour-card">
                <div className="tour-card-content">
                  <h3>{tour.name}</h3>
                  <p>{tour.description.slice(0, 100)}...</p>
                  <div className="tour-meta">
                    <span>Duration: {tour.duration}</span>
                    <span>Price: ${tour.price}</span>
                  </div>
                </div>
                <div className="tour-actions">
                  <button
                    onClick={() => handleSelectTour(tour)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tour._id)}
                    disabled={isDeleting}
                    className="delete-button"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTour && (
        <form onSubmit={handleUpdate} className="tour-form">
          <h2>Update Tour: {selectedTour.name}</h2>

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
                value={formData.inclusions.join(', ')}
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
                value={formData.availableDates.join(', ')}
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
                        {preview.size && <span>{(preview.size / 1024).toFixed(2)} KB</span>}
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

          <div className="action-buttons">
            <button
              type="submit"
              disabled={isSubmitting || isDeleting}
              className="submit-button"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Updating...
                </>
              ) : (
                'Update Tour'
              )}
            </button>
            <button
              type="button"
              onClick={() => setSelectedTour(null)}
              disabled={isSubmitting || isDeleting}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TourDashboardPage;