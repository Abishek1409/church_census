import axios from 'axios';
import axiosRetry from 'axios-retry';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Update this URL with your deployed Render.com backend URL
// After completing Task 4 (Deploy backend to Render.com), replace this with your actual URL
// Example: 'https://church-census-api.onrender.com/api'
// For local testing, use: 'http://localhost:3000/api'
const API_BASE_URL = 'https://church-census.onrender.com/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout (accounting for Render.com spin-up time)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure automatic retry for failed requests
axiosRetry(apiClient, {
  retries: 3, // Number of retry attempts
  retryDelay: (retryCount) => {
    // Exponential backoff: 1s, 2s, 4s
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return (
      axiosRetry.isNetworkError(error) ||
      axiosRetry.isRetryableError(error) ||
      (error.response && error.response.status >= 500)
    );
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.log(`Retry attempt ${retryCount} for ${requestConfig.url}`);
  },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      
      // Add Authorization header if token exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving auth token:', error);
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle auth errors and successful responses
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (__DEV__) {
      console.log(`✓ ${response.config.method.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    // Enhanced error logging
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      
      console.error('API Error:', {
        status: status,
        data: error.response.data,
        url: error.config?.url,
      });

      // Handle authentication errors
      if (status === 401) {
        // Unauthorized - Token expired or invalid
        console.log('401 Unauthorized: Clearing stored token');
        
        try {
          // Clear stored token
          await AsyncStorage.multiRemove(['authToken', 'user', 'activeRegion']);
          
          // Note: Navigation to LoginScreen will be handled by AuthContext
          // The AuthContext will detect the cleared token and redirect appropriately
        } catch (clearError) {
          console.error('Error clearing auth data:', clearError);
        }
      } else if (status === 403) {
        // Forbidden - Insufficient permissions or region access denied
        console.log('403 Forbidden: Access denied');
        
        // Add user-friendly error message if not present
        if (!error.response.data?.error?.message) {
          error.response.data = {
            ...error.response.data,
            error: {
              code: 'FORBIDDEN',
              message: 'You do not have permission to access this resource.',
            },
          };
        }
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', {
        message: error.message,
        url: error.config?.url,
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
