const { verifyToken } = require('../utils/jwt');
const { UserRegion, Region } = require('../models');

/**
 * Middleware to authenticate JWT token from Authorization header
 * Attaches decoded user info to req.user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication token is required'
        }
      });
    }

    // Verify and decode token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.message === 'TOKEN_EXPIRED') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Authentication token has expired'
        }
      });
    } else if (error.message === 'TOKEN_INVALID') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_INVALID',
          message: 'Invalid authentication token'
        }
      });
    }

    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication failed'
      }
    });
  }
};

/**
 * Middleware factory to check if user has required role
 * Must be used after authenticateToken middleware
 * @param {Array<string>} allowedRoles - Array of allowed roles (e.g., ['ADMINISTRATOR'])
 * @returns {Function} Express middleware function
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated (req.user should be set by authenticateToken)
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions to access this resource'
        }
      });
    }

    next();
  };
};

/**
 * Middleware to load user's assigned regions and attach to request
 * Must be used after authenticateToken middleware
 * Administrators skip region check (have access to all regions)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const checkRegionAccess = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    // Administrators have access to all regions - skip region loading
    if (req.user.role === 'ADMINISTRATOR') {
      req.userRegions = []; // Empty array indicates all regions access
      return next();
    }

    // For field workers, load assigned regions
    try {
      const userRegions = await UserRegion.findAll({
        where: { userId: req.user.userId },
        include: [{
          model: Region,
          as: 'region',
          where: { isActive: true },
          required: true
        }]
      });

      // Extract region IDs
      const regionIds = userRegions.map(ur => ur.regionId);

      // Attach region IDs to request for use in subsequent middleware/controllers
      req.userRegions = regionIds;

      // Also attach full region data for reference
      req.userRegionsData = userRegions.map(ur => ({
        id: ur.region.id,
        name: ur.region.name,
        type: ur.region.type,
        assignedAt: ur.assignedAt
      }));

      next();
    } catch (queryError) {
      // Log the actual database error
      console.error('=== DATABASE ERROR IN checkRegionAccess ===');
      console.error('Error name:', queryError.name);
      console.error('Error message:', queryError.message);
      console.error('Full error:', queryError);
      console.error('=========================================');
      
      // Return a more helpful error
      return res.status(500).json({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to load user region access',
          details: queryError.message
        }
      });
    }
  } catch (error) {
    console.error('=== UNEXPECTED ERROR IN checkRegionAccess ===');
    console.error('Error:', error);
    console.error('==========================================');
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to load user region access'
      }
    });
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  checkRegionAccess
};
