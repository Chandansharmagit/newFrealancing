// components/MediaUploader.jsx
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Delete } from '@mui/icons-material';
import './MediaUploader.css';

const MediaUploader = ({ 
  title,
  acceptText,
  files, 
  onDrop, 
  removeFile, 
  accept,
  icon
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDrop,
  });

  return (
    <div className="media-uploader">
      <div className="uploader-header">
        {icon && <span className="uploader-icon">{icon}</span>}
        <h3 className="uploader-title">{title}</h3>
      </div>
      
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
      >
        <input {...getInputProps()} />
        <p className="dropzone-text">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
        </p>
        <span className="dropzone-subtext">{acceptText}</span>
      </div>

      {files.length > 0 && (
        <div className="media-preview-grid">
          {files.map((file, index) => (
            <div className="media-preview-item" key={index}>
              {file.type.startsWith('image/') ? (
                <img
                  src={file.preview}
                  alt={`Preview ${index + 1}`}
                  className="media-preview-image"
                />
              ) : (
                <video
                  src={file.preview}
                  controls
                  className="media-preview-video"
                />
              )}
              
              <button 
                type="button"
                className="media-remove-button"
                onClick={() => removeFile(index)}
                aria-label="Remove file"
              >
                <Delete />
              </button>
              
              <div className="media-filename">
                {file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;