const { body, validationResult } = require('express-validator');
const { User, Region, UserRegion } = require('../models');
const { generateToken } = require('../utils/jwt');

/**
 * Login validation rules
 */
const loginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
const login = async (req, res) => {
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

    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({
      where: { username },
      include: [{
        model: Region,
        as: 'assignedRegions',
        through: {
          attributes: ['assignedAt']
        },
        attributes: ['id', 'name', 'type', 'description'],
        where: { isActive: true },
        required: false
      }]
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid username or password'
        }
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Your account has been deactivated. Please contact an administrator.'
        }
      });
    }

    // Verify password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid username or password'
        }
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });

    // Update last login timestamp
    await user.update({ lastLogin: new Date() });

    // Format user data (exclude password)
    const userData = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin
    };

    // Format assigned regions
    const regions = user.assignedRegions || [];

    // Return success response
    return res.status(200).json({
      success: true,
      data: {
        token,
        user: userData,
        regions
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred during login. Please try again.'
      }
    });
  }
};

/**
 * POST /api/auth/logout
 * Logout user (token invalidation handled client-side)
 */
const logout = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    const userId = req.user.userId;

    // Update user's lastLogin timestamp as logout time
    const user = await User.findByPk(userId);
    if (user) {
      await user.update({ lastLogin: new Date() });
    }

    // Return success response
    // Note: Token invalidation is handled client-side by removing it from storage
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred during logout'
      }
    });
  }
};

/**
 * GET /api/auth/me
 * Get current authenticated user info with assigned regions
 * Requires authentication
 */
const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    const userId = req.user.userId;

    // Fetch user with assigned regions
    const user = await User.findByPk(userId, {
      include: [{
        model: Region,
        as: 'assignedRegions',
        through: {
          attributes: ['assignedAt']
        },
        attributes: ['id', 'name', 'type', 'description'],
        where: { isActive: true },
        required: false
      }],
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

    // Check if account is still active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Your account has been deactivated'
        }
      });
    }

    // Format user data
    const userData = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    // Format assigned regions
    const regions = user.assignedRegions || [];

    return res.status(200).json({
      success: true,
      data: {
        user: userData,
        regions
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching user info'
      }
    });
  }
};

/**
 * POST /api/auth/refresh
 * Refresh JWT token - issue new token to extend session
 * Requires authentication (valid token)
 */
const refreshToken = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    const userId = req.user.userId;

    // Fetch user to ensure they still exist and are active
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'role', 'isActive']
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

    // Check if account is still active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Your account has been deactivated'
        }
      });
    }

    // Generate new JWT token
    const newToken = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });

    return res.status(200).json({
      success: true,
      data: {
        token: newToken
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while refreshing token'
      }
    });
  }
};

module.exports = {
  login,
  loginValidation,
  logout,
  getCurrentUser,
  refreshToken
};
