/**
 * API Status Checker
 * Periodically checks API availability and displays a status banner
 */

import { checkApiStatus, API_CONFIG, diagnoseCors } from './api-client.js';

// Configuration for status checker
const STATUS_CONFIG = {
  checkInterval: 60000, // Check every minute
  displayDuration: 10000, // Display banner for 10 seconds
  checkOnLoad: true // Check when page loads
};

let checkIntervalId = null;
let statusBanner = null;

/**
 * Initialize the API status checker
 * @param {Object} options - Configuration options
 */
export function initStatusChecker(options = {}) {
  // Merge default config with options
  const config = { ...STATUS_CONFIG, ...options };
  
  // Create status banner
  createStatusBanner();
  
  // Check API status on page load
  if (config.checkOnLoad) {
    checkAndUpdateStatus();
  }
  
  // Set up interval to check status periodically
  checkIntervalId = setInterval(checkAndUpdateStatus, config.checkInterval);
  
  // Add event listener for page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Check status when page becomes visible again
      checkAndUpdateStatus();
    }
  });
}

/**
 * Stop the status checker
 */
export function stopStatusChecker() {
  if (checkIntervalId) {
    clearInterval(checkIntervalId);
    checkIntervalId = null;
  }
}

/**
 * Create the status banner element
 */
function createStatusBanner() {
  // If banner already exists, return
  if (statusBanner || document.getElementById('api-status-banner')) {
    return;
  }
  
  // Create banner element
  statusBanner = document.createElement('div');
  statusBanner.id = 'api-status-banner';
  statusBanner.style.display = 'none';
  statusBanner.style.position = 'fixed';
  statusBanner.style.bottom = '20px';
  statusBanner.style.right = '20px';
  statusBanner.style.padding = '12px 20px';
  statusBanner.style.borderRadius = '4px';
  statusBanner.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  statusBanner.style.zIndex = '9999';
  statusBanner.style.maxWidth = '300px';
  statusBanner.style.fontFamily = 'Arial, sans-serif';
  statusBanner.style.fontSize = '14px';
  statusBanner.style.transition = 'opacity 0.3s ease-in-out';
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.background = 'transparent';
  closeButton.style.border = 'none';
  closeButton.style.color = 'inherit';
  closeButton.style.position = 'absolute';
  closeButton.style.right = '5px';
  closeButton.style.top = '5px';
  closeButton.style.fontSize = '18px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.padding = '0 5px';
  closeButton.style.lineHeight = '1';
  
  closeButton.addEventListener('click', () => {
    statusBanner.style.display = 'none';
  });
  
  statusBanner.appendChild(closeButton);
  
  // Add content container
  const contentDiv = document.createElement('div');
  contentDiv.id = 'api-status-content';
  statusBanner.appendChild(contentDiv);
  
  // Add to document
  document.body.appendChild(statusBanner);
}

/**
 * Check API status and update the banner
 */
async function checkAndUpdateStatus() {
  try {
    // Check if API is in mock mode
    if (API_CONFIG.mockMode) {
      // If we're in mock mode, check if API is actually available
      const isAvailable = await checkApiStatus();
      
      if (isAvailable) {
        // API is available but we're in mock mode
        showStatusBanner('API is now available. Reload to use live API.', 'available');
      }
    } else {
      // In live mode, check if API is still available
      const isAvailable = await checkApiStatus();
      
      if (!isAvailable) {
        // API was supposed to be available but isn't
        showStatusBanner('API connection lost. Switched to offline mode.', 'unavailable');
        
        // Switch to mock mode automatically
        API_CONFIG.mockMode = true;
        
        // Run diagnostics
        const corsInfo = await diagnoseCors();
        console.warn('API connectivity issue detected. CORS diagnostics:', corsInfo);
      }
    }
  } catch (error) {
    console.error('Error checking API status:', error);
  }
}

/**
 * Show the status banner with a message
 * @param {string} message - Message to display
 * @param {string} type - Type of message ('available' or 'unavailable')
 */
function showStatusBanner(message, type = 'info') {
  if (!statusBanner) {
    createStatusBanner();
  }
  
  const contentDiv = document.getElementById('api-status-content');
  if (!contentDiv) return;
  
  // Set banner style based on type
  if (type === 'available') {
    statusBanner.style.backgroundColor = '#4CAF50';
    statusBanner.style.color = 'white';
  } else if (type === 'unavailable') {
    statusBanner.style.backgroundColor = '#f44336';
    statusBanner.style.color = 'white';
  } else {
    statusBanner.style.backgroundColor = '#2196F3';
    statusBanner.style.color = 'white';
  }
  
  // Set content
  contentDiv.textContent = message;
  
  // Show banner
  statusBanner.style.display = 'block';
  
  // Auto-hide after a delay
  setTimeout(() => {
    if (statusBanner) {
      statusBanner.style.display = 'none';
    }
  }, STATUS_CONFIG.displayDuration);
} 