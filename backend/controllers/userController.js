const { body, validationResult } = require('express-validator');
const { User, Region, UserRegion } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

/**
 * Validation rules for creating a user
 */
const createUserValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters')
];

/**
 * Validation rules for updating a user
 */
const updateUserValidation = [
  body('fullName')
    .optional()
    .trim()
    .notEmpty().withMessage('Full name cannot be empty')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  body('role')
    .optional()
    .isIn(['ADMINISTRATOR', 'FIELD_WORKER']).withMessage('Role must be ADMINISTRATOR or FIELD_WORKER'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean value')
];

/**
 * Validation rules for assigning regions
 */
const assignRegionsValidation = [
  body('regionIds')
    .isArray({ min: 0 }).withMessage('regionIds must be an array')
    .custom((value) => {
      if (!Array.isArray(value)) return false;
      return value.every(id => Number.isInteger(id) && id > 0);
    }).withMessage('All regionIds must be positive integers')
];

/**
 * Validation rules for resetting password
 */
const resetPasswordValidation = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

/**
 * POST /api/users
 * Create a new field worker account
 * Requires ADMINISTRATOR role
 */
const createUser = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }

    const { username, password, fullName, role } = req.body;

    // Check for duplicate username
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_USERNAME',
          message: 'Username already exists'
        }
      });
    }

    // Create user with default role as FIELD_WORKER
    const user = await User.create({
      username,
      password, // Will be hashed by beforeCreate hook
      fullName,
      role: role || 'FIELD_WORKER',
      isActive: true
    });

    // Return created user (exclude password)
    const userData = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    return res.status(201).json({
      success: true,
      data: userData,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while creating user'
      }
    });
  }
};

/**
 * GET /api/users
 * List all field workers with their assigned regions
 * Requires ADMINISTRATOR role
 * Supports pagination via query params: page, limit
 */
const listUsers = async (req, res) => {
  try {
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Query users with pagination
    const { count, rows: users } = await User.findAndCountAll({
      where: {
        role: 'FIELD_WORKER' // Only list field workers
      },
      include: [{
        model: Region,
        as: 'assignedRegions',
        through: {
          attributes: ['assignedAt', 'assignedBy']
        },
        attributes: ['id', 'name', 'type', 'description', 'isActive'],
        required: false
      }],
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    // Format response
    const usersData = users.map(user => ({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      assignedRegions: user.assignedRegions || []
    }));

    return res.status(200).json({
      success: true,
      data: usersData,
      pagination: {
        page,
        limit,
        totalRecords: count,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('List users error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching users'
      }
    });
  }
};

/**
 * PUT /api/users/:id
 * Update a user's information
 * Requires ADMINISTRATOR role
 * Allows updating: fullName, role, isActive
 * Username cannot be changed
 */
const updateUser = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }

    const userId = parseInt(req.params.id);
    const { fullName, role, isActive } = req.body;

    // Check if trying to update username (not allowed)
    if (req.body.username) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USERNAME_IMMUTABLE',
          message: 'Username cannot be changed'
        }
      });
    }

    // Find user
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Update only provided fields
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    await user.update(updateData);

    // Fetch updated user data
    const updatedUser = await User.findByPk(userId, {
      include: [{
        model: Region,
        as: 'assignedRegions',
        through: {
          attributes: ['assignedAt']
        },
        attributes: ['id', 'name', 'type', 'description'],
        required: false
      }],
      attributes: { exclude: ['password'] }
    });

    return res.status(200).json({
      success: true,
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        lastLogin: updatedUser.lastLogin,
        createdAt: updatedUser.createdAt,
        assignedRegions: updatedUser.assignedRegions || []
      },
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while updating user'
      }
    });
  }
};

/**
 * PUT /api/users/:id/regions
 * Assign regions to a user
 * Requires ADMINISTRATOR role
 * Replaces all existing region assignments with new ones
 */
const assignRegions = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }

    const userId = parseInt(req.params.id);
    const { regionIds } = req.body;
    const adminUserId = req.user.userId; // Admin making the assignment

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Validate that all regionIds exist and are active
    if (regionIds.length > 0) {
      const regions = await Region.findAll({
        where: {
          id: { [Op.in]: regionIds },
          isActive: true
        }
      });

      if (regions.length !== regionIds.length) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REGIONS',
            message: 'One or more region IDs are invalid or inactive'
          }
        });
      }
    }

    // Delete existing region assignments for this user
    await UserRegion.destroy({
      where: { userId }
    });

    // Create new region assignments
    if (regionIds.length > 0) {
      const userRegionData = regionIds.map(regionId => ({
        userId,
        regionId,
        assignedBy: adminUserId,
        assignedAt: new Date()
      }));

      await UserRegion.bulkCreate(userRegionData);
    }

    // Fetch updated user with regions
    const updatedUser = await User.findByPk(userId, {
      include: [{
        model: Region,
        as: 'assignedRegions',
        through: {
          attributes: ['assignedAt', 'assignedBy']
        },
        attributes: ['id', 'name', 'type', 'description'],
        required: false
      }],
      attributes: { exclude: ['password'] }
    });

    return res.status(200).json({
      success: true,
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        assignedRegions: updatedUser.assignedRegions || []
      },
      message: 'Regions assigned successfully'
    });

  } catch (error) {
    console.error('Assign regions error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while assigning regions'
      }
    });
  }
};

/**
 * PUT /api/users/:id/password
 * Reset a user's password
 * Requires ADMINISTRATOR role
 */
const resetPassword = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }

    const userId = parseInt(req.params.id);
    const { password } = req.body;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Update password (will be hashed by beforeUpdate hook)
    await user.update({ password });

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while resetting password'
      }
    });
  }
};

/**
 * DELETE /api/users/:id
 * Deactivate a user (soft delete)
 * Requires ADMINISTRATOR role
 * Sets isActive to false instead of deleting the record
 */
const deactivateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Find user
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Prevent deactivating the last administrator
    if (user.role === 'ADMINISTRATOR') {
      const adminCount = await User.count({
        where: {
          role: 'ADMINISTRATOR',
          isActive: true
        }
      });

      if (adminCount === 1) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'LAST_ADMIN',
            message: 'Cannot deactivate the last administrator account'
          }
        });
      }
    }

    // Soft delete: set isActive to false
    await user.update({ isActive: false });

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        isActive: user.isActive
      },
      message: 'User deactivated successfully'
    });

  } catch (error) {
    console.error('Deactivate user error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while deactivating user'
      }
    });
  }
};

module.exports = {
  createUser,
  createUserValidation,
  listUsers,
  updateUser,
  updateUserValidation,
  assignRegions,
  assignRegionsValidation,
  resetPassword,
  resetPasswordValidation,
  deactivateUser
};
