/**
 * Personal Potions API Client
 * Handles API communication with support for mock mode and retry logic
 */

// Configurable API settings
export const API_CONFIG = {
  baseUrl: 'https://personal-potions-api.vercel.app',
  mockMode: true, // Set to false when API is available
  timeout: 10000,
  retryAttempts: 3,
  logLevel: 'debug' // 'debug', 'info', 'error', or 'none'
};

/**
 * Submit survey data to the API
 * @param {Object} data - The survey form data
 * @returns {Promise<Object>} - API response or mock response
 */
export async function submitSurvey(data) {
  if (API_CONFIG.mockMode) {
    return handleMockSubmission(data);
  }
  
  return apiRequest('/api/customers/survey', {
    method: 'POST',
    data
  });
}

/**
 * Check if the API is available
 * @returns {Promise<boolean>} - True if API is available
 */
export async function checkApiStatus() {
  try {
    // Try to fetch the base endpoint
    const response = await fetch(`${API_CONFIG.baseUrl}/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      timeout: 5000 // Shorter timeout for status check
    });
    
    logMessage(`API status check: ${response.status}`, 'info');
    return response.ok;
  } catch (error) {
    logMessage(`API unavailable: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Check API CORS configuration
 * @returns {Promise<Object>} - CORS diagnostic information
 */
export async function diagnoseCors() {
  const results = {
    optionsRequest: false,
    postRequest: false,
    corsHeaders: {},
    errors: []
  };
  
  // Test OPTIONS request
  try {
    const optionsResponse = await fetch(`${API_CONFIG.baseUrl}/api/customers/survey`, {
      method: 'OPTIONS'
    });
    
    results.optionsRequest = optionsResponse.ok;
    results.corsHeaders = {};
    
    // Log all headers
    for (const [key, value] of optionsResponse.headers.entries()) {
      if (key.toLowerCase().includes('access-control') || 
          key.toLowerCase().includes('allow')) {
        results.corsHeaders[key] = value;
      }
    }
  } catch (error) {
    results.errors.push(`OPTIONS request failed: ${error.message}`);
  }
  
  // Test minimal POST request
  try {
    const postResponse = await fetch(`${API_CONFIG.baseUrl}/api/customers/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    });
    
    results.postRequest = postResponse.ok;
  } catch (error) {
    results.errors.push(`POST request failed: ${error.message}`);
  }
  
  return results;
}

/**
 * Make an API request with retry logic
 * @param {string} endpoint - API endpoint to call
 * @param {Object} options - Request options
 * @returns {Promise<Object>} - API response
 */
async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', data, headers = {} } = options;
  let attempts = 0;
  let delay = 1000;
  
  while (attempts < API_CONFIG.retryAttempts) {
    try {
      logMessage(`Attempting ${method} request to ${endpoint} (attempt ${attempts + 1})`, 'debug');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
      
      const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      logMessage(`Response status: ${response.status}`, 'debug');
      
      if (!response.ok) {
        let errorMessage = `API error: ${response.status} ${response.statusText}`;
        let errorData = {};
        
        try {
          errorData = await response.json();
          logMessage(`Error response: ${JSON.stringify(errorData)}`, 'debug');
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response isn't JSON, try to get text
          const errorText = await response.text();
          logMessage(`Error response text: ${errorText}`, 'debug');
        }
        
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      logMessage(`API response: ${JSON.stringify(responseData)}`, 'debug');
      return responseData;
    } catch (error) {
      attempts++;
      const isTimeout = error.name === 'AbortError';
      const errorType = isTimeout ? 'timeout' : 'error';
      
      logMessage(`API ${errorType} (attempt ${attempts}): ${error.message}`, 'error');
      
      if (attempts < API_CONFIG.retryAttempts) {
        logMessage(`Retrying in ${delay}ms...`, 'debug');
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        logMessage(`All ${API_CONFIG.retryAttempts} attempts failed`, 'error');
        throw error;
      }
    }
  }
}

/**
 * Handle mock submission in development mode
 * @param {Object} data - The survey form data
 * @returns {Promise<Object>} - Mock API response
 */
function handleMockSubmission(data) {
  logMessage('Using mock submission mode', 'info');
  
  // Store in localStorage
  const id = `submission_${Date.now()}`;
  localStorage.setItem(id, JSON.stringify(data));
  localStorage.setItem('personalPotionsLatestSubmission', id);
  
  // Simulate network delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        customer: {
          id: id,
          ...data
        }
      });
    }, 800);
  });
}

/**
 * Log message based on configured log level
 * @param {string} message - Message to log
 * @param {string} level - Log level ('debug', 'info', 'error')
 */
function logMessage(message, level = 'debug') {
  const levels = {
    debug: 0,
    info: 1,
    error: 2,
    none: 3
  };
  
  if (levels[level] >= levels[API_CONFIG.logLevel]) {
    const prefix = `[API Client ${level.toUpperCase()}]`;
    
    switch (level) {
      case 'error':
        console.error(prefix, message);
        break;
      case 'info':
        console.info(prefix, message);
        break;
      case 'debug':
      default:
        console.log(prefix, message);
    }
  }
} 