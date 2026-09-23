const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
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
} = require('../controllers/userController');

/**
 * All user management routes require ADMINISTRATOR role
 */

/**
 * @route   POST /api/users
 * @desc    Create a new field worker account
 * @access  Private (ADMINISTRATOR only)
 */
router.post(
  '/',
  authenticateToken,
  requireRole(['ADMINISTRATOR']),
  createUserValidation,
  createUser
);

/**
 * @route   GET /api/users
 * @desc    List all field workers with their assigned regions
 * @access  Private (ADMINISTRATOR only)
 */
router.get(
  '/',
  authenticateToken,
  requireRole(['ADMINISTRATOR']),
  listUsers
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user's information (fullName, role, isActive)
 * @access  Private (ADMINISTRATOR only)
 */
router.put(
  '/:id',
  authenticateToken,
  requireRole(['ADMINISTRATOR']),
  updateUserValidation,
  updateUser
);

/**
 * @route   PUT /api/users/:id/regions
 * @desc    Assign regions to a user
 * @access  Private (ADMINISTRATOR only)
 */
router.put(
  '/:id/regions',
  authenticateToken,
  requireRole(['ADMINISTRATOR']),
  assignRegionsValidation,
  assignRegions
);

/**
 * @route   PUT /api/users/:id/password
 * @desc    Reset a user's password
 * @access  Private (ADMINISTRATOR only)
 */
router.put(
  '/:id/password',
  authenticateToken,
  requireRole(['ADMINISTRATOR']),
  resetPasswordValidation,
  resetPassword
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Deactivate a user (soft delete)
 * @access  Private (ADMINISTRATOR only)
 */
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['ADMINISTRATOR']),
  deactivateUser
);

module.exports = router;
