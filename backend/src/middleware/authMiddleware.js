// backend/src/middleware/authMiddleware.js
const { verifyToken } = require('../utils/jwtUtils');
const db = require('../config/database');

/**
 * Middleware to protect routes.
 * Checks for a valid JWT in the Authorization header.
 */
const protect = (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = verifyToken(token);

      // Find user by ID from the decoded token, excluding password_hash
      const user = db.prepare('SELECT id, phone_number, display_name, avatar_url, about, last_seen FROM users WHERE id = ?').get(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };