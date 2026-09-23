const { Member } = require('../models');
const { Op } = require('sequelize');

// Health check endpoint for keep-alive
exports.healthCheck = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_ERROR',
        message: 'Health check failed'
      }
    });
  }
};

// Validation helper function
const validateMemberData = (data, isUpdate = false) => {
  const errors = [];

  // Full Name validation
  if (!data.fullName || data.fullName.trim() === '') {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  }

  // Aadhar Number validation
  if (!data.aadharNumber) {
    errors.push({ field: 'aadharNumber', message: 'Aadhar number is required' });
  } else if (!/^[0-9]{12}$/.test(data.aadharNumber)) {
    errors.push({ field: 'aadharNumber', message: 'Aadhar number must be exactly 12 digits' });
  }

  // Phone Number validation
  if (!data.phoneNumber) {
    errors.push({ field: 'phoneNumber', message: 'Phone number is required' });
  } else if (!/^[0-9]{10}$/.test(data.phoneNumber)) {
    errors.push({ field: 'phoneNumber', message: 'Phone number must be exactly 10 digits' });
  }

  // Community validation
  if (!data.community || data.community.trim() === '') {
    errors.push({ field: 'community', message: 'Community is required' });
  }

  // Sub-caste validation
  if (!data.subCaste || data.subCaste.trim() === '') {
    errors.push({ field: 'subCaste', message: 'Sub-caste is required' });
  }

  // Housing Type validation
  const validHousingTypes = ['Rent', 'Owned', 'Government Provided'];
  if (!data.housingType) {
    errors.push({ field: 'housingType', message: 'Housing type is required' });
  } else if (!validHousingTypes.includes(data.housingType)) {
    errors.push({ field: 'housingType', message: 'Housing type must be Rent, Owned, or Government Provided' });
  }

  // Address validation
  if (!data.address || data.address.trim() === '') {
    errors.push({ field: 'address', message: 'Address is required' });
  }

  // Conditional Patta validation
  if (data.housingType === 'Owned') {
    // Patta is optional but must be boolean if provided
    if (data.hasPatta !== undefined && data.hasPatta !== null && typeof data.hasPatta !== 'boolean') {
      errors.push({ field: 'hasPatta', message: 'Patta must be a boolean value' });
    }
  } else {
    // Clear hasPatta if housing type is not Owned
    data.hasPatta = null;
  }

  // Occupation validation
  if (!data.occupation || data.occupation.trim() === '') {
    errors.push({ field: 'occupation', message: 'Occupation is required' });
  }

  // Income validation
  if (data.income === undefined || data.income === null || data.income === '') {
    errors.push({ field: 'income', message: 'Income is required' });
  } else if (isNaN(data.income) || parseFloat(data.income) < 0) {
    errors.push({ field: 'income', message: 'Income must be a positive number' });
  }

  // Education Qualification validation
  if (!data.educationQualification || data.educationQualification.trim() === '') {
    errors.push({ field: 'educationQualification', message: 'Education qualification is required' });
  }

  // Ration Card Number validation
  if (!data.rationCardNumber || data.rationCardNumber.trim() === '') {
    errors.push({ field: 'rationCardNumber', message: 'Ration card number is required' });
  }

  return errors;
};

// Create new member
exports.createMember = async (req, res) => {
  try {
    // For FIELD_WORKER: auto-assign region from their assigned region (ignore req.body.regionId)
    // For ADMINISTRATOR: use req.body.regionId
    let regionId;
    
    if (req.user.role === 'FIELD_WORKER') {
      // Field worker must have exactly one assigned region for member creation
      if (!req.userRegions || req.userRegions.length === 0) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'NO_ASSIGNED_REGION',
            message: 'You do not have any assigned regions. Contact your administrator.'
          }
        });
      }
      
      // Auto-assign to field worker's first (or only) assigned region
      regionId = req.userRegions[0];
    } else if (req.user.role === 'ADMINISTRATOR') {
      // Administrator must provide regionId in request body
      if (!req.body.regionId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Region ID is required',
            details: [{ field: 'regionId', message: 'Region ID is required' }]
          }
        });
      }
      regionId = req.body.regionId;
    }

    // Validate input
    const validationErrors = validateMemberData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: validationErrors
        }
      });
    }

    // Check for duplicate Aadhar number
    const existingMember = await Member.findOne({
      where: { aadharNumber: req.body.aadharNumber }
    });

    if (existingMember) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_AADHAR',
          message: 'A member with this Aadhar number already exists',
          field: 'aadharNumber'
        }
      });
    }

    // Create member with auto-assigned regionId
    const memberData = {
      ...req.body,
      regionId // Override with server-determined regionId
    };
    
    const member = await Member.create(memberData);

    // Load member with region info
    const memberWithRegion = await Member.findByPk(member.id, {
      include: [{
        model: require('../models').Region,
        as: 'region',
        attributes: ['id', 'name', 'type']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: memberWithRegion
    });
  } catch (error) {
    console.error('Error creating member:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
          details: error.errors?.map(e => ({ field: e.path, message: e.message }))
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to create member'
      }
    });
  }
};

// Get all members with pagination
exports.getAllMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Build where clause based on user role
    const where = {};
    
    // If user is FIELD_WORKER, filter by assigned regions
    if (req.user.role === 'FIELD_WORKER') {
      if (!req.userRegions || req.userRegions.length === 0) {
        // Field worker has no assigned regions
        return res.status(200).json({
          success: true,
          data: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0
          }
        });
      }
      where.regionId = { [Op.in]: req.userRegions };
    }
    // ADMINISTRATOR sees all members (no filter)

    const { count, rows } = await Member.findAndCountAll({
      where,
      include: [{
        model: require('../models').Region,
        as: 'region',
        attributes: ['id', 'name', 'type']
      }],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to fetch members'
      }
    });
  }
};

// Get single member by ID
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id, {
      include: [{
        model: require('../models').Region,
        as: 'region',
        attributes: ['id', 'name', 'type']
      }]
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Member not found'
        }
      });
    }

    // Check region access for FIELD_WORKER
    if (req.user.role === 'FIELD_WORKER') {
      if (!member.regionId || !req.userRegions.includes(member.regionId)) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have access to this member\'s region'
          }
        });
      }
    }
    // ADMINISTRATOR can access any member

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to fetch member'
      }
    });
  }
};

// Update member
exports.updateMember = async (req, res) => {
  try {
    // Check if member exists
    const member = await Member.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Member not found'
        }
      });
    }

    // Check region access for FIELD_WORKER
    if (req.user.role === 'FIELD_WORKER') {
      if (!member.regionId || !req.userRegions.includes(member.regionId)) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have access to update this member\'s region'
          }
        });
      }

      // Prevent field workers from changing regionId
      if (req.body.regionId && req.body.regionId !== member.regionId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Field workers cannot reassign members to different regions. Contact an administrator.'
          }
        });
      }
    }
    // ADMINISTRATOR can update any member and change regions

    // Validate input
    const validationErrors = validateMemberData(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: validationErrors
        }
      });
    }

    // Check for duplicate Aadhar number (excluding current member)
    if (req.body.aadharNumber && req.body.aadharNumber !== member.aadharNumber) {
      const existingMember = await Member.findOne({
        where: {
          aadharNumber: req.body.aadharNumber,
          id: { [Op.ne]: req.params.id }
        }
      });

      if (existingMember) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'DUPLICATE_AADHAR',
            message: 'A member with this Aadhar number already exists',
            field: 'aadharNumber'
          }
        });
      }
    }

    // Update member
    await member.update(req.body);

    // Load updated member with region info
    const updatedMember = await Member.findByPk(member.id, {
      include: [{
        model: require('../models').Region,
        as: 'region',
        attributes: ['id', 'name', 'type']
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: updatedMember
    });
  } catch (error) {
    console.error('Error updating member:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
          details: error.errors?.map(e => ({ field: e.path, message: e.message }))
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to update member'
      }
    });
  }
};

// Delete member
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Member not found'
        }
      });
    }

    // Check region access for FIELD_WORKER
    if (req.user.role === 'FIELD_WORKER') {
      if (!member.regionId || !req.userRegions.includes(member.regionId)) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have access to delete this member\'s region'
          }
        });
      }
    }
    // ADMINISTRATOR can delete any member

    await member.destroy();

    res.status(200).json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to delete member'
      }
    });
  }
};

// Search members by name
exports.searchMembers = async (req, res) => {
  try {
    const query = req.query.query || '';

    if (!query.trim()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Search query is required'
        }
      });
    }

    // Build where clause with region filter
    const where = {
      fullName: {
        [Op.iLike]: `%${query}%`
      }
    };

    // Add region filter for FIELD_WORKER
    if (req.user.role === 'FIELD_WORKER') {
      if (!req.userRegions || req.userRegions.length === 0) {
        // Field worker has no assigned regions
        return res.status(200).json({
          success: true,
          data: [],
          count: 0
        });
      }
      where.regionId = { [Op.in]: req.userRegions };
    }
    // ADMINISTRATOR searches all regions (no filter)

    const members = await Member.findAll({
      where,
      include: [{
        model: require('../models').Region,
        as: 'region',
        attributes: ['id', 'name', 'type']
      }],
      order: [['fullName', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: members,
      count: members.length
    });
  } catch (error) {
    console.error('Error searching members:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to search members'
      }
    });
  }
};

// Filter members by community and housing type
exports.filterMembers = async (req, res) => {
  try {
    const { community, housingType } = req.query;
    const where = {};

    // Add user-provided filters
    if (community) {
      where.community = community;
    }

    if (housingType) {
      where.housingType = housingType;
    }

    // Add region filter for FIELD_WORKER
    if (req.user.role === 'FIELD_WORKER') {
      if (!req.userRegions || req.userRegions.length === 0) {
        // Field worker has no assigned regions
        return res.status(200).json({
          success: true,
          data: [],
          count: 0,
          filters: { community, housingType }
        });
      }
      where.regionId = { [Op.in]: req.userRegions };
    }
    // ADMINISTRATOR sees all regions (no region filter)

    const members = await Member.findAll({
      where,
      include: [{
        model: require('../models').Region,
        as: 'region',
        attributes: ['id', 'name', 'type']
      }],
      order: [['fullName', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: members,
      count: members.length,
      filters: { community, housingType }
    });
  } catch (error) {
    console.error('Error filtering members:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to filter members'
      }
    });
  }
};

// Get statistics
exports.getStats = async (req, res) => {
  try {
    // Ensure req.user exists (should be set by authenticateToken middleware)
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    // Build where clause based on user role
    const where = {};
    
    // Add region filter for FIELD_WORKER
    if (req.user.role === 'FIELD_WORKER') {
      if (!req.userRegions || req.userRegions.length === 0) {
        // Field worker has no assigned regions
        return res.status(200).json({
          success: true,
          data: {
            totalMembers: 0,
            housingBreakdown: {
              Rent: 0,
              Owned: 0,
              'Government Provided': 0
            }
          }
        });
      }
      where.regionId = { [Op.in]: req.userRegions };
    }
    // ADMINISTRATOR gets stats for all regions (no filter)

    // Get total members count
    const totalMembers = await Member.count({ where });

    // Get housing type breakdown
    const housingStats = await Member.findAll({
      attributes: [
        'housingType',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where,
      group: ['housingType']
    });

    const housingBreakdown = {
      Rent: 0,
      Owned: 0,
      'Government Provided': 0
    };

    housingStats.forEach(stat => {
      housingBreakdown[stat.housingType] = parseInt(stat.dataValues.count);
    });

    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        housingBreakdown
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to fetch statistics'
      }
    });
  }
};
