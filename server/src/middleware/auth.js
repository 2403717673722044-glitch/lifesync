const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

// This middleware checks if the user is authenticated
// It verifies the JWT token and attaches the user to the request

const auth = async (req, res, next) => {
  try {
    // 1. Get token from header
    let token = req.header('x-auth-token') || req.header('Authorization');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied. Please login.'
      });
    }

    // 2. Remove 'Bearer ' prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.substring(7);
    }

    // 3. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please login again.'
        });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.'
        });
      }
      throw err;
    }

    // 4. Find user from token
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Invalid token.'
      });
    }

    // 5. Attach user to request object
    req.user = user;
    next();

  } catch (err) {
    console.error('❌ Auth Middleware Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

module.exports = auth;