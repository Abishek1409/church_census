/**
 * AuthContext - Mobile Authentication Context
 * 
 * Provides authentication functionality for the Church Census mobile app.
 * Manages user authentication state, token storage, and region-based access control.
 * 
 * Features:
 * - User login with username/password
 * - Secure token storage in AsyncStorage
 * - Automatic token validation on app start
 * - User logout with session cleanup
 * - Active region management for field workers
 * - Error handling with user-friendly messages
 * 
 * Usage:
 * 1. Wrap your app with <AuthProvider>
 * 2. Use the useAuth() hook to access auth state and functions
 * 
 * @module contexts/AuthContext
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../config/api';

// Create AuthContext
const AuthContext = createContext();

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'authToken',
  USER: 'user',
  ACTIVE_REGION: 'activeRegion',
};

/**
 * AuthProvider component that wraps the app and provides authentication context
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeRegion, setActiveRegionState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load stored authentication data from AsyncStorage on app start
   * Validates the stored token with the backend
   */
  const loadStoredAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Retrieve stored auth data
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const storedActiveRegion = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_REGION);

      if (storedToken && storedUser) {
        // Validate token with backend
        try {
          const response = await apiClient.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          // Token is valid, restore session
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          if (storedActiveRegion) {
            setActiveRegionState(JSON.parse(storedActiveRegion));
          } else if (response.data.data?.regions?.length > 0) {
            // Set first region as default if no active region stored
            const defaultRegion = response.data.data.regions[0];
            setActiveRegionState(defaultRegion);
            await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_REGION, JSON.stringify(defaultRegion));
          }
        } catch (validationError) {
          // Token is invalid or expired, clear stored data
          console.log('Stored token is invalid, clearing auth data');
          await clearStoredAuth();
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      await clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear all stored authentication data
   */
  const clearStoredAuth = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.USER,
        STORAGE_KEYS.ACTIVE_REGION,
      ]);
      setToken(null);
      setUser(null);
      setActiveRegionState(null);
    } catch (error) {
      console.error('Error clearing stored auth:', error);
    }
  };

  /**
   * Login function - authenticates user with username and password
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<Object>} User data and regions
   */
  const login = async (username, password) => {
    try {
      setError(null);
      setIsLoading(true);

      // Call login API endpoint
      const response = await apiClient.post('/auth/login', {
        username,
        password,
      });

      const { token: authToken, user: userData, regions } = response.data.data;

      // Attach regions to user data for easy access
      const userWithRegions = { ...userData, regions };

      // Store token in AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithRegions));

      // Update state
      setToken(authToken);
      setUser(userWithRegions);

      // Set default activeRegion (first assigned region)
      if (regions && regions.length > 0) {
        const defaultRegion = regions[0];
        setActiveRegionState(defaultRegion);
        await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_REGION, JSON.stringify(defaultRegion));
      }

      return { success: true, user: userData, regions };
    } catch (err) {
      // Handle login errors with user-friendly messages
      let errorMessage = 'Login failed. Please try again.';

      if (err.response) {
        const status = err.response.status;
        const errorData = err.response.data;

        switch (status) {
          case 401:
            errorMessage = errorData?.error?.message || 'Invalid username or password.';
            break;
          case 403:
            errorMessage = errorData?.error?.message || 'Account is inactive. Please contact administrator.';
            break;
          case 404:
            errorMessage = 'Login service not found. Please check your connection.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = errorData?.error?.message || 'An unexpected error occurred.';
        }
      } else if (err.request) {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function - terminates user session
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call logout endpoint if token exists
      if (token) {
        try {
          await apiClient.post('/auth/logout', {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (err) {
          // Continue with logout even if API call fails
          console.log('Logout API call failed, continuing with local logout', err);
        }
      }

      // Clear token and user from AsyncStorage
      await clearStoredAuth();
    } catch (err) {
      console.error('Error during logout:', err);
      // Ensure local state is cleared even if there's an error
      await clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Set active region for the current session
   * @param {Object} region - Region object to set as active
   * @returns {Promise<boolean>} Success status
   */
  const setActiveRegion = async (region) => {
    try {
      // Validate that the selected region is in user's assigned regions
      if (!user || !user.regions) {
        throw new Error('User data not available');
      }

      const isRegionAssigned = user.regions.some(
        (assignedRegion) => assignedRegion.id === region.id
      );

      if (!isRegionAssigned) {
        throw new Error('Selected region is not assigned to this user');
      }

      // Update activeRegion state
      setActiveRegionState(region);

      // Persist active region in AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_REGION, JSON.stringify(region));

      return true;
    } catch (err) {
      console.error('Error setting active region:', err);
      setError(err.message);
      return false;
    }
  };

  // Load stored auth on component mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const value = {
    user,
    token,
    activeRegion,
    isLoading,
    error,
    login,
    logout,
    setActiveRegion,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use AuthContext
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
