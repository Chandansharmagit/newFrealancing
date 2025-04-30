// src/services/trackingService.js

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Track when users click to contact via WhatsApp
 * @param {string} tourId - The ID of the tour being viewed
 * @returns {Promise} - The tracking API response
 */
export const trackWhatsAppRequest = async (tourId) => {
  try {
    // Get user ID from localStorage if available
    const userId = localStorage.getItem('userId') || 'anonymous';
    
    // Additional tracking data
    const trackingData = {
      userId,
      tourId,
      source: 'whatsapp',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct'
    };
    
    // Send tracking data to API
    const response = await axios.post(
      `${API_BASE_URL}/api/tracking/contact-request`, 
      trackingData
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to track WhatsApp request:', error);
    // Non-blocking - failures shouldn't interrupt user experience
    return { success: false, error: error.message };
  }
};

/**
 * Generate a unique user ID and store in localStorage if not already present
 * Used for anonymous tracking when user isn't logged in
 */
export const ensureUserId = () => {
  if (!localStorage.getItem('userId')) {
    const generatedId = 'user_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('userId', generatedId);
  }
  return localStorage.getItem('userId');
};

/**
 * Get tracking data for a specific user
 * @param {string} userId - The ID of the user to filter by (defaults to current user from localStorage)
 * @returns {Promise} - The tracking data for the specified user
 */
export const getUserTrackingData = async (userId = null) => {
  try {
    // If no userId provided, use the one from localStorage
    if (!userId) {
      userId = localStorage.getItem('userId');
      if (!userId) {
        return { success: false, error: 'No user ID available' };
      }
    }
    
    const response = await axios.get(
      `${API_BASE_URL}/api/tracking/user/${userId}`
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user tracking data:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

/**
 * Get tracking data for a specific tour
 * @param {string} tourId - The ID of the tour to filter by
 * @returns {Promise} - The tracking data for the specified tour
 */
export const getTourTrackingData = async (tourId) => {
  try {
    if (!tourId) {
      return { success: false, error: 'Tour ID is required' };
    }
    
    const response = await axios.get(
      `${API_BASE_URL}/api/tracking/tour/${tourId}`
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch tour tracking data:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

/**
 * Get combined tracking data for a specific user and tour
 * @param {string} userId - The ID of the user
 * @param {string} tourId - The ID of the tour
 * @returns {Promise} - The tracking data filtered by both user and tour
 */
export const getUserTourInteractions = async (userId, tourId) => {
  try {
    if (!userId || !tourId) {
      return { success: false, error: 'Both user ID and tour ID are required' };
    }
    
    const response = await axios.get(
      `${API_BASE_URL}/api/tracking/filter?userId=${userId}&tourId=${tourId}`
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user-tour interaction data:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};