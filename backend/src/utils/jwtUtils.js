// backend/src/utils/jwtUtils.js
const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for a given user payload.
 * @param {Object} payload - Usually contains { id, phone_number }
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token valid for 30 days for a good user experience
  });
};

/**
 * Verifies a JWT token.
 * @param {String} token - The JWT token to verify
 * @returns {Object} Decoded payload if valid, throws error if invalid
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};