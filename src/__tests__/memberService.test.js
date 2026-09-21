import apiClient from '../config/api';
import {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
  searchMembers,
  filterMembers,
  getStats,
  healthCheck,
} from '../services/memberService';

// Mock the API client
jest.mock('../config/api');

describe('Member Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMemberData = {
    fullName: 'John Doe',
    aadharNumber: '123456789012',
    phoneNumber: '9876543210',
    community: 'Catholic',
    subCaste: 'Latin',
    housingType: 'Owned',
    address: '123 Main St',
    hasPatta: true,
    occupation: 'Teacher',
    income: 25000,
    educationQualification: 'Bachelor',
    rationCardNumber: 'RC123',
  };

  const mockMemberResponse = {
    id: 1,
    ...mockMemberData,
  };

  describe('createMember', () => {
    it('should create a new member successfully', async () => {
      const mockResponse = { data: mockMemberResponse };
      apiClient.post = jest.fn().mockResolvedValue(mockResponse);

      const result = await createMember(mockMemberData);

      expect(apiClient.post).toHaveBeenCalledWith('/members', mockMemberData);
      expect(result).toEqual(mockMemberResponse);
    });

    it('should handle duplicate Aadhar error', async () => {
      const mockError = {
        response: {
          status: 409,
          data: { message: 'Aadhar number already exists' },
        },
      };
      apiClient.post = jest.fn().mockRejectedValue(mockError);

      await expect(createMember(mockMemberData)).rejects.toThrow();
    });

    it('should handle network error', async () => {
      const mockError = {
        request: {},
        message: 'Network Error',
      };
      apiClient.post = jest.fn().mockRejectedValue(mockError);

      await expect(createMember(mockMemberData)).rejects.toThrow();
    });
  });

  describe('getAllMembers', () => {
    it('should get all members with default pagination', async () => {
      const mockResponse = {
        data: {
          members: [mockMemberResponse],
          total: 1,
          page: 1,
          limit: 20,
        },
      };
      apiClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await getAllMembers();

      expect(apiClient.get).toHaveBeenCalledWith('/members', {
        params: { page: 1, limit: 20 },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should get members with custom pagination', async () => {
      const mockResponse = {
        data: {
          members: [mockMemberResponse],
          total: 1,
          page: 2,
          limit: 10,
        },
      };
      apiClient.get = jest.fn().mockResolvedValue(mockResponse);

      await getAllMembers(2, 10);

      expect(apiClient.get).toHaveBeenCalledWith('/members', {
        params: { page: 2, limit: 10 },
      });
    });
  });

  describe('getMemberById', () => {
    it('should get a member by ID', async () => {
      const mockResponse = { data: mockMemberResponse };
      apiClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await getMemberById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/members/1');
      expect(result).toEqual(mockMemberResponse);
    });

    it('should handle member not found error', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Member not found' },
        },
      };
      apiClient.get = jest.fn().mockRejectedValue(mockError);

      await expect(getMemberById(999)).rejects.toThrow();
    });
  });

  describe('updateMember', () => {
    it('should update a member successfully', async () => {
      const updatedData = { ...mockMemberData, fullName: 'Jane Doe' };
      const mockResponse = { data: { ...mockMemberResponse, ...updatedData } };
      apiClient.put = jest.fn().mockResolvedValue(mockResponse);

      const result = await updateMember(1, updatedData);

      expect(apiClient.put).toHaveBeenCalledWith('/members/1', updatedData);
      expect(result.fullName).toBe('Jane Doe');
    });

    it('should handle validation error on update', async () => {
      const mockError = {
        response: {
          status: 400,
          data: { message: 'Invalid data' },
        },
      };
      apiClient.put = jest.fn().mockRejectedValue(mockError);

      await expect(updateMember(1, {})).rejects.toThrow();
    });
  });

  describe('deleteMember', () => {
    it('should delete a member successfully', async () => {
      const mockResponse = { data: { message: 'Member deleted successfully' } };
      apiClient.delete = jest.fn().mockResolvedValue(mockResponse);

      const result = await deleteMember(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/members/1');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle delete error', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Member not found' },
        },
      };
      apiClient.delete = jest.fn().mockRejectedValue(mockError);

      await expect(deleteMember(999)).rejects.toThrow();
    });
  });

  describe('searchMembers', () => {
    it('should search members by name', async () => {
      const mockResponse = {
        data: {
          members: [mockMemberResponse],
          count: 1,
        },
      };
      apiClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await searchMembers('John');

      expect(apiClient.get).toHaveBeenCalledWith('/members/search', {
        params: { query: 'John' },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should return empty results for no matches', async () => {
      const mockResponse = {
        data: {
          members: [],
          count: 0,
        },
      };
      apiClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await searchMembers('NonExistent');

      expect(result.members).toEqual([]);
      expect(result.count).toBe(0);
    });
  });

  describe('filterMembers', () => {
    it('should filter members by community', async () => {
      const mockResponse = {
        data: {
          members: [mockMemberResponse],
          count: 1,
        },
      };
      apiClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await filterMembers({ community: 'Catholic' });

      expect(apiClient.get).toHaveBeenCalledWith('/members/filter', {
        params: { community: 'Catholic' },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should filter members by housing type', async () => {
      const mockResponse = {
        data: {
          members: [mockMemberResponse],
          count: 1,
        },
      };
      apiClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await filterMembers({ housingType: 'Owned' });

      expect(apiClient.get).toHaveBeenCalledWith('/members/filter', {
        params: { housingType: 'Owned' },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should filter by multiple criteria', async () => {
      const mockResponse = {
        data: {
          members: [mockMemberResponse],
          count: 1,
        },
      };
      apiClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await filterMembers({
        community: 'Catholic',
        housingType: 'Owned',
      });

      expect(apiClient.get).toHaveBeenCalledWith('/members/filter', {
        params: { community: 'Catholic', housingType: 'Owned' },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getStats', () => {
    it('should get statistics', async () => {
      const mockResponse = {
        data: {
          totalMembers: 100,
          housingTypeBreakdown: {
            Rent: 40,
            Owned: 50,
            'Government Provided': 10,
          },
        },
      };
      apiClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await getStats();

      expect(apiClient.get).toHaveBeenCalledWith('/stats');
      expect(result.totalMembers).toBe(100);
    });
  });

  describe('healthCheck', () => {
    it('should perform health check', async () => {
      const mockResponse = {
        data: {
          status: 'ok',
          timestamp: new Date().toISOString(),
        },
      };
      apiClient.get = jest.fn().mockResolvedValue(mockResponse);

      const result = await healthCheck();

      expect(apiClient.get).toHaveBeenCalledWith('/health');
      expect(result.status).toBe('ok');
    });
  });
});
