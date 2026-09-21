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

    // Create member
    const member = await Member.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: member
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

    const { count, rows } = await Member.findAndCountAll({
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

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: member
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

    const members = await Member.findAll({
      where: {
        fullName: {
          [Op.iLike]: `%${query}%`
        }
      },
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

    if (community) {
      where.community = community;
    }

    if (housingType) {
      where.housingType = housingType;
    }

    const members = await Member.findAll({
      where,
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
    // Get total members count
    const totalMembers = await Member.count();

    // Get housing type breakdown
    const housingStats = await Member.findAll({
      attributes: [
        'housingType',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
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
