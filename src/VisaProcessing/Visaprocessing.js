import React, { useState, useEffect } from 'react';
import './VisaProcessing.css';

const VisaProcessing = () => {
  const [step, setStep] = useState('apply'); // apply | upload | track
  const [formData, setFormData] = useState({
    fullName: '',
    passportNumber: '',
    nationality: '',
    visaType: '',
    travelDate: '',
    contactNumber: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [documents, setDocuments] = useState([]); // Array for up to 2 images
  const [previewUrls, setPreviewUrls] = useState([]); // Array for image previews
  const [trackingId, setTrackingId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(33);
  const [submissionStatus, setSubmissionStatus] = useState('');

  useEffect(() => {
    if (step === 'apply') setProgress(33);
    else if (step === 'upload') setProgress(66);
    else if (step === 'track') setProgress(100);
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url)); // Cleanup preview URLs
    };
  }, [step, previewUrls]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.passportNumber.match(/^[A-Z0-9]{6,12}$/)) {
      newErrors.passportNumber = 'Enter a valid passport number (6-12 alphanumeric)';
    }
    if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
    if (!formData.visaType) newErrors.visaType = 'Please select a visa type';
    if (!formData.travelDate) newErrors.travelDate = 'Travel date is required';
    else if (new Date(formData.travelDate) < new Date()) {
      newErrors.travelDate = 'Travel date must be in the future';
    }
    if (!formData.contactNumber.match(/^\+?\d{10,15}$/)) {
      newErrors.contactNumber = 'Enter a valid contact number (10-15 digits)';
    }
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = 'Enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + documents.length > 2) {
      alert('You can upload a maximum of 2 images.');
      return;
    }
    const validFiles = files.filter((file) =>
      ['image/jpeg', 'image/png'].includes(file.type)
    );
    if (validFiles.length !== files.length) {
      alert('Please upload valid images (JPEG or PNG).');
      return;
    }
    setDocuments([...documents, ...validFiles]);
    setPreviewUrls([...previewUrls, ...validFiles.map((file) => URL.createObjectURL(file))]);
    alert('Images uploaded successfully!');
  };

  const removeImage = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/visa/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setSubmissionStatus(result.trackingId);
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          setStep('upload');
        }, 2000);
      } else {
        alert('Submission failed: ' + result.message);
      }
    } catch (error) {
      alert('Error submitting application: ' + error.message);
    }
    setIsLoading(false);
  };

  const handleUploadSubmit = async () => {
    if (documents.length === 0) {
      alert('Please upload at least one image.');
      return;
    }
    setIsLoading(true);
    const formDataToSend = new FormData();
    documents.forEach((doc, index) => {
      formDataToSend.append('documents', doc);
    });
    formDataToSend.append('trackingId', submissionStatus);

    try {
      const response = await fetch('http://localhost:5000/api/visa/upload', {
        method: 'POST',
        body: formDataToSend,
      });
      const result = await response.json();
      if (response.ok) {
        alert('Documents uploaded successfully!');
        setStep('track');
      } else {
        alert('Upload failed: ' + result.message);
      }
    } catch (error) {
      alert('Error uploading documents: ' + error.message);
    }
    setIsLoading(false);
  };

  const handleTrack = async () => {
    if (!trackingId.match(/^[A-Z0-9]{8,12}$/)) {
      alert('Please enter a valid tracking ID (8-12 alphanumeric)');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/visa/track/${trackingId}`);
      const result = await response.json();
      if (response.ok) {
        alert(`Status for ${trackingId}: ${result.status}`);
      } else {
        alert('Tracking failed: ' + result.message);
      }
    } catch (error) {
      alert('Error tracking application: ' + error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="visa-processing-wrapper">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="visa-header">
        <h1>🌍 Visa Adventure Hub</h1>
        <p>Embark on your journey with style and ease!</p>
      </div>
      <div className="visa-buttons">
        <button
          className={step === 'apply' ? 'active' : ''}
          onClick={() => setStep('apply')}
          disabled={isLoading}
        >
          Apply
        </button>
        <button
          className={step === 'upload' ? 'active' : ''}
          onClick={() => setStep('upload')}
          disabled={isLoading}
        >
          Upload Images
        </button>
        <button
          className={step === 'track' ? 'active' : ''}
          onClick={() => setStep('track')}
          disabled={isLoading}
        >
          Track Status
        </button>
      </div>

      {step === 'apply' && (
        <form className="visa-form" onSubmit={handleFormSubmit}>
          <h2>Start Your Visa Quest</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            {errors.fullName && <span className="error">{errors.fullName}</span>}
          </div>
          <div className="form-group">
            <label>Passport Number</label>
            <input
              type="text"
              name="passportNumber"
              placeholder="E.g., AB123456"
              value={formData.passportNumber}
              onChange={handleChange}
              required
            />
            {errors.passportNumber && <span className="error">{errors.passportNumber}</span>}
          </div>
          <div className="form-group">
            <label>Nationality</label>
            <input
              type="text"
              name="nationality"
              placeholder="Your nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
            />
            {errors.nationality && <span className="error">{errors.nationality}</span>}
          </div>
          <div className="form-group">
            <label>Visa Type</label>
            <select name="visaType" value={formData.visaType} onChange={handleChange} required>
              <option value="">Select Visa Type</option>
              <option value="Tourist">Tourist</option>
              <option value="Student">Student</option>
              <option value="Work">Work</option>
              <option value="Business">Business</option>
            </select>
            {errors.visaType && <span className="error">{errors.visaType}</span>}
          </div>
          <div className="form-group">
            <label>Travel Date</label>
            <input
              type="date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              required
            />
            {errors.travelDate && <span className="error">{errors.travelDate}</span>}
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              placeholder="E.g., +1234567890"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
            {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Launch Application'}
          </button>
        </form>
      )}

      {step === 'upload' && (
        <div className="upload-section">
          <h2>Upload Your Docs</h2>
          <p>Upload up to 2 images (JPEG or PNG).</p>
          <input
            type="file"
            accept="image/jpeg,image/png"
            multiple
            onChange={handleFileUpload}
            disabled={documents.length >= 2}
          />
          <div className="file-preview">
            {previewUrls.map((url, index) => (
              <div key={index} className="preview-item">
                <img src={url} alt={`Preview ${index + 1}`} />
                <button className="remove-btn" onClick={() => removeImage(index)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button onClick={handleUploadSubmit} disabled={isLoading || documents.length === 0}>
            {isLoading ? 'Uploading...' : 'Submit Documents'}
          </button>
        </div>
      )}

      {step === 'track' && (
        <div className="track-section">
          <h2>Track Your Journey</h2>
          <p>Enter your tracking ID to see where you're at!</p>
          <input
            type="text"
            placeholder="E.g., VISA12345678"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button onClick={handleTrack} disabled={isLoading}>
            {isLoading ? 'Checking...' : 'Check Status'}
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Success! 🚀</h3>
            <p>Your visa application is off to a great start!</p>
            <p>Tracking ID: {submissionStatus}</p>
            <p>Next: Upload your documents.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisaProcessing;