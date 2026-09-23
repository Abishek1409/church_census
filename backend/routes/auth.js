const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  login,
  loginValidation,
  logout,
  getCurrentUser,
  refreshToken
} = require('../controllers/authController');

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT token
 * @access  Public
 */
router.post('/login', loginValidation, login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (updates lastLogin timestamp)
 * @access  Private (requires authentication)
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user info with assigned regions
 * @access  Private (requires authentication)
 */
router.get('/me', authenticateToken, getCurrentUser);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token to extend session
 * @access  Private (requires authentication)
 */
router.post('/refresh', authenticateToken, refreshToken);

module.exports = router;
