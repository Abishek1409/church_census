/**
 * Error Handler Utility
 * Provides user-friendly error messages for different error scenarios
 */

export const getErrorMessage = (error) => {
  // Network errors (no response from server)
  if (error.request && !error.response) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return 'Request timed out. The server is taking too long to respond. Please try again.';
    }
    return 'Cannot reach server. Please check your internet connection and try again.';
  }

  // Server responded with an error
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return data?.message || data?.error?.message || 'Invalid request. Please check your input and try again.';
      
      case 401:
        return 'Authentication failed. Please log in again.';
      
      case 403:
        return 'You do not have permission to perform this action.';
      
      case 404:
        return data?.message || 'The requested resource was not found.';
      
      case 409:
        // Duplicate entry (e.g., Aadhar number already exists)
        return data?.message || data?.error?.message || 'This record already exists. Please check and try again.';
      
      case 422:
        return data?.message || 'Validation failed. Please check your input.';
      
      case 500:
        return 'Server error. Please try again later.';
      
      case 503:
        return 'Service temporarily unavailable. Please try again in a moment.';
      
      default:
        return data?.message || data?.error?.message || `Server error (${status}). Please try again.`;
    }
  }

  // Generic errors
  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Check if error is a network error (no internet connection)
 */
export const isNetworkError = (error) => {
  return (
    error.request &&
    !error.response &&
    (error.message.includes('Network') || error.code === 'ERR_NETWORK')
  );
};

/**
 * Check if error is a timeout error
 */
export const isTimeoutError = (error) => {
  return (
    error.code === 'ECONNABORTED' ||
    error.message.includes('timeout')
  );
};

/**
 * Check if error is a server error (5xx)
 */
export const isServerError = (error) => {
  return error.response && error.response.status >= 500;
};

/**
 * Check if error is a client error (4xx)
 */
export const isClientError = (error) => {
  return error.response && error.response.status >= 400 && error.response.status < 500;
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error) => {
  return isNetworkError(error) || isTimeoutError(error) || isServerError(error);
};
