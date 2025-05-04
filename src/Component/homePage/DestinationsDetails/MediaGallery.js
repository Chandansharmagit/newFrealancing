import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import './MediaGallery.css';

const MediaGallery = ({ destination }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Format the image and video data with proper URLs
  const images = destination?.images?.map(img => ({
    url: `${img.path}`,
    alt: destination.title || 'Destination image',
    type: 'image'
  })) || [];
  
  const videos = destination?.videos?.map(vid => ({
    url: `${vid.path}`,
    // For thumbnails, we'll use a generic approach or first image if available
    thumbnail: images.length > 0 ? images[0].url : null,
    alt: destination.title || 'Destination video',
    type: 'video'
  })) || [];
  
  const allMedia = [...images, ...videos];
  const hasMoreMedia = allMedia.length > 3;
  
  // Helper function to determine if item is video
  const isVideo = (item) => item.type === 'video';

  // Handle opening the modal gallery
  const openModal = (index) => {
    setActiveIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Handle closing the modal gallery
  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  // Navigate through media in the modal
  const navigate = (direction) => {
    if (direction === 'next') {
      setActiveIndex((prevIndex) => (prevIndex === allMedia.length - 1 ? 0 : prevIndex + 1));
    } else {
      setActiveIndex((prevIndex) => (prevIndex === 0 ? allMedia.length - 1 : prevIndex - 1));
    }
  };

  // Handle clicking "View all photos"
  const handleSeeAll = (e) => {
    e.stopPropagation(); // Prevent triggering the parent onclick
    openModal(0); // Open the modal starting from the first image
  };
  
  // If there are no media items
  if (allMedia.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg">
        <Image className="text-gray-400" size={48} />
        <p className="mt-2 text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full gallery-container">
        {/* Main Gallery Layout */}
        <div className="gallery-grid">
          {/* Main large image (left side) */}
          <div 
            className="main-image"
            onClick={() => openModal(0)}
          >
            {isVideo(allMedia[0]) ? (
              <video
                src={allMedia[0].url}
                className="w-full h-full object-cover"
                alt={allMedia[0].alt}
                poster={allMedia[0].thumbnail}
                controls
              />
            ) : (
              <img
                src={allMedia[0].url}
                className="w-full h-full object-cover"
                alt={allMedia[0].alt}
                loading="lazy"
              />
            )}
            
            {/* View more photos overlay for small screens */}
            {hasMoreMedia && (
              <div className="view-all-small-screens">
                <div onClick={(e) => { e.stopPropagation(); handleSeeAll(e); }}>
                  <Image size={18} className="mr-1" />
                  <span>View all {allMedia.length} pictures and videos</span>
                </div>
              </div>
            )}
          </div>

          {/* Right side images */}
          <div className="side-images">
            {/* Top right image */}
            {allMedia.length > 1 && (
              <div 
                className="side-image"
                onClick={() => openModal(1)}
              >
                {isVideo(allMedia[1]) ? (
                  <video
                    src={allMedia[1].url}
                    className="w-full h-full object-cover"
                    alt={allMedia[1].alt}
                    poster={allMedia[1].thumbnail}
                  />
                ) : (
                  <img
                    src={allMedia[1].url}
                    className="w-full h-full object-cover"
                    alt={allMedia[1].alt}
                    loading="lazy"
                  />
                )}
              </div>
            )}

            {/* Bottom right image with optional overlay */}
            {allMedia.length > 2 && (
              <div 
                className="side-image"
                onClick={() => openModal(2)}
              >
                {isVideo(allMedia[2]) ? (
                  <video
                    src={allMedia[2].url}
                    className="w-full h-full object-cover"
                    alt={allMedia[2].alt}
                    poster={allMedia[2].thumbnail}
                  />
                ) : (
                  <img
                    src={allMedia[2].url}
                    className="w-full h-full object-cover"
                    alt={allMedia[2].alt}
                    loading="lazy"
                  />
                )}
                
                {/* Show "View all X pictures" button if there are more than 3 images */}
                {hasMoreMedia && (
                  <div className="view-all-overlay">
                    <div className="text-center" onClick={(e) => { e.stopPropagation(); handleSeeAll(e); }}>
                      <Image size={24} className="mx-auto mb-2" />
                      <span>View all {allMedia.length} pictures and videos </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Optional "View all photos" button at bottom for mobile */}
        <div className="view-all-button-mobile">
          <button onClick={() => openModal(0)} className="flex items-center justify-center">
            <Image size={16} className="mr-2" />
            View all {allMedia.length} photos
          </button>
        </div>
      </div>

      {/* Modal Gallery */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-button gallery-nav-button"
              onClick={closeModal} 
              aria-label="Close gallery"
            >
              <X size={24} />
            </button>
            
            <div className="modal-image-container">
              <div className="modal-image">
                {isVideo(allMedia[activeIndex]) ? (
                  <video 
                    className="current-media"
                    src={allMedia[activeIndex].url} 
                    controls 
                    autoPlay={false}
                    alt={allMedia[activeIndex].alt}
                  />
                ) : (
                  <img
                    className="current-media"
                    src={allMedia[activeIndex].url}
                    alt={allMedia[activeIndex].alt}
                    loading="lazy"
                  />
                )}
              </div>
              
              <button 
                className="prev-button gallery-nav-button"
                onClick={() => navigate('prev')}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button 
                className="next-button gallery-nav-button"
                onClick={() => navigate('next')}
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            <div className="thumbnails-container">
              {allMedia.map((item, index) => (
                <img
                  key={index}
                  src={isVideo(item) ? (item.thumbnail || item.url) : item.url}
                  alt={`Thumbnail ${index + 1}`}
                  className={index === activeIndex ? 'active-thumbnail' : 'inactive-thumbnail'}
                  onClick={() => setActiveIndex(index)}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaGallery;