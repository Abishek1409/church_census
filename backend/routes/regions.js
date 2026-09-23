const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  createRegion,
  createRegionValidation,
  listRegions,
  updateRegion,
  updateRegionValidation,
  deleteRegion
} = require('../controllers/regionController');

/**
 * @route   GET /api/regions
 * @desc    List all active regions
 * @access  Private (requires authentication)
 */
router.get(
  '/',
  authenticateToken,
  listRegions
);

/**
 * @route   POST /api/regions
 * @desc    Create a new region
 * @access  Private (ADMINISTRATOR only)
 */
router.post(
  '/',
  authenticateToken,
  requireRole(['ADMINISTRATOR']),
  createRegionValidation,
  createRegion
);

/**
 * @route   PUT /api/regions/:id
 * @desc    Update a region's information
 * @access  Private (ADMINISTRATOR only)
 */
router.put(
  '/:id',
  authenticateToken,
  requireRole(['ADMINISTRATOR']),
  updateRegionValidation,
  updateRegion
);

/**
 * @route   DELETE /api/regions/:id
 * @desc    Delete a region (soft delete)
 * @access  Private (ADMINISTRATOR only)
 */
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['ADMINISTRATOR']),
  deleteRegion
);

module.exports = router;
