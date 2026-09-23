const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

/**
 * Generate JWT token for authenticated user
 * @param {Object} payload - User data to encode in token
 * @param {number} payload.userId - User ID
 * @param {string} payload.username - Username
 * @param {string} payload.role - User role (ADMINISTRATOR or FIELD_WORKER)
 * @returns {string} Signed JWT token
 */
const generateToken = (payload) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const { userId, username, role } = payload;

  if (!userId || !username || !role) {
    throw new Error('Missing required fields for token generation');
  }

  return jwt.sign(
    { userId, username, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  if (!token) {
    throw new Error('Token is required');
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('TOKEN_EXPIRED');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('TOKEN_INVALID');
    }
    throw error;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
