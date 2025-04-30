// DestinationUpload.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./DestinationUpload.css";

import { uploadFileInChunks } from "./uploadFileInChunks";


const DestinationUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    bestTimeToVisit: "",
    thingsToDo: "",
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  //getting userid

  useEffect(() => {
    // Cleanup URLs when component unmounts
    return () => {
      [...images, ...videos].forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [images, videos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const onDropImages = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatFileSize(file.size),
      })
    );
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const onDropVideos = useCallback((acceptedFiles) => {
    const newVideos = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatFileSize(file.size),
      })
    );
    setVideos((prev) => [...prev, ...newVideos]);
  }, []);

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } =
    useDropzone({
      accept: { "image/*": [] },
      onDrop: onDropImages,
    });

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } =
    useDropzone({
      accept: { "video/*": [] },
      onDrop: onDropVideos,
    });

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      5000
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.location || !formData.description) {
      showNotification("Please fill all required fields", "error");
      return;
    }

    if (images.length === 0) {
      showNotification("Please upload at least one image", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Track file IDs and info for submission
      const uploadedImageInfo = [];
      const uploadedVideoInfo = [];
      const fileIds = [];

      // First upload all files
      const imageUploads = await Promise.all(
        images.map((file, index) =>
          uploadFileInChunks(file, "images", (progress) => {
            setUploadProgress((prev) => ({
              ...prev,
              [`image-${index}`]: progress,
            }));
          })
        )
      );

      const videoUploads = await Promise.all(
        videos.map((file, index) =>
          uploadFileInChunks(file, "videos", (progress) => {
            setUploadProgress((prev) => ({
              ...prev,
              [`video-${index}`]: progress,
            }));
          })
        )
      );

      // Collect all file information
      imageUploads.forEach((upload) => {
        if (upload.fileInfo) {
          uploadedImageInfo.push(upload.fileInfo);
          fileIds.push(upload.fileId);
        }
      });

      videoUploads.forEach((upload) => {
        if (upload.fileInfo) {
          uploadedVideoInfo.push(upload.fileInfo);
          fileIds.push(upload.fileId);
        }
      });

      // Submit form data with file information
      const response = await fetch("http://localhost:5000/api/destinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          images: uploadedImageInfo,
          videos: uploadedVideoInfo,
          fileIds: fileIds,
          userId: localStorage.getItem("userId"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit destination");
      }

      // Reset form on success
      setFormData({
        title: "",
        location: "",
        description: "",
        bestTimeToVisit: "",
        thingsToDo: "",
      });
      setImages([]);
      setVideos([]);
      setUploadProgress({});

      showNotification("Destination uploaded successfully!", "success");
    } catch (error) {
      console.error("Upload error:", error);
      showNotification("Error uploading files. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="destination-container">
        <h1 className="destination-title">Upload Destination</h1>

        <form onSubmit={handleSubmit} className="destination-form">
          <div className="form-flex-container">
            {/* Left column */}
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">
                  Destination Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter destination title"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Location <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="City, Country"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Best Time to Visit</label>
                <input
                  type="text"
                  name="bestTimeToVisit"
                  value={formData.bestTimeToVisit}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="E.g., Summer, June-August"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Things to Do</label>
                <textarea
                  name="thingsToDo"
                  value={formData.thingsToDo}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="List activities and attractions"
                  rows="4"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Describe this destination"
                  rows="6"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Images <span className="required">*</span>
                </label>
                <div {...getImageRootProps()} className="dropzone">
                  <input {...getImageInputProps()} />
                  <p>Drop images here or click to browse</p>
                </div>

                {images.length > 0 && (
                  <div className="file-preview-container">
                    {images.map((file, index) => (
                      <div key={`image-${index}`} className="file-preview">
                        <img
                          src={file.preview}
                          alt={`Preview ${index}`}
                          className="file-thumbnail"
                        />
                        <div className="file-info">
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">
                            {file.formattedSize}
                          </span>
                          {uploadProgress[`image-${index}`] > 0 &&
                            uploadProgress[`image-${index}`] < 100 && (
                              <div className="progress-bar">
                                <div
                                  className="progress-fill"
                                  style={{
                                    width: `${
                                      uploadProgress[`image-${index}`]
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            )}
                        </div>
                        <button
                          type="button"
                          className="remove-file"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Videos (Optional)</label>
                <div {...getVideoRootProps()} className="dropzone">
                  <input {...getVideoInputProps()} />
                  <p>Drop videos here or click to browse</p>
                </div>

                {videos.length > 0 && (
                  <div className="file-preview-container">
                    {videos.map((file, index) => (
                      <div key={`video-${index}`} className="file-preview">
                        <video
                          src={file.preview}
                          className="file-thumbnail"
                          muted
                        />
                        <div className="file-info">
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">
                            {file.formattedSize}
                          </span>
                          {uploadProgress[`video-${index}`] > 0 &&
                            uploadProgress[`video-${index}`] < 100 && (
                              <div className="progress-bar">
                                <div
                                  className="progress-fill"
                                  style={{
                                    width: `${
                                      uploadProgress[`video-${index}`]
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            )}
                        </div>
                        <button
                          type="button"
                          className="remove-file"
                          onClick={() => removeVideo(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Upload Destination"}
            </button>
          </div>
        </form>

        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
      </div>

      {/* <Sidebar/> */}
    </>
  );
};

export default DestinationUpload;
