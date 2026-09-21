import apiClient from '../config/api';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * Member Service - API calls for member CRUD operations
 * All methods now throw formatted error messages
 */

// Create a new member
export const createMember = async (memberData) => {
  try {
    const response = await apiClient.post('/members', memberData);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

// Get all members with optional pagination
export const getAllMembers = async (page = 1, limit = 20) => {
  try {
    const response = await apiClient.get('/members', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

// Get a single member by ID
export const getMemberById = async (id) => {
  try {
    const response = await apiClient.get(`/members/${id}`);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

// Update a member
export const updateMember = async (id, memberData) => {
  try {
    const response = await apiClient.put(`/members/${id}`, memberData);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

// Delete a member
export const deleteMember = async (id) => {
  try {
    const response = await apiClient.delete(`/members/${id}`);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

// Search members by name
export const searchMembers = async (query) => {
  try {
    const response = await apiClient.get('/members/search', {
      params: { query },
    });
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

// Filter members by community and/or housing type
export const filterMembers = async (filters) => {
  try {
    const response = await apiClient.get('/members/filter', {
      params: filters,
    });
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

// Get statistics
export const getStats = async () => {
  try {
    const response = await apiClient.get('/stats');
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message);
  }
};
