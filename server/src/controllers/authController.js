const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// ============================================
// HELPER FUNCTIONS
// ============================================

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'secretkey',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// ============================================
// REGISTER CONTROLLER
// ============================================

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    console.log('📝 Registration request received');

    const { name, email, password, confirmPassword } = req.body;

    // --- VALIDATION ---

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Validate name length
    if (name.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters'
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // --- CHECK EXISTING USER ---

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email. Please login.'
      });
    }

    // --- HASH PASSWORD ---

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // --- CREATE USER ---

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      preferences: {
        theme: 'light',
        currency: 'USD'
      }
    });

    // --- GENERATE TOKEN ---

    const token = generateToken(user._id);

    // --- SEND RESPONSE ---

    console.log('✅ User registered successfully:', email);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to LifeSync! 🎉',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt
      }
    });

  } catch (err) {
    console.error('❌ Registration Error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server error during registration'
    });
  }
};

// ============================================
// LOGIN CONTROLLER
// ============================================

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    console.log('🔑 Login request received');

    const { email, password } = req.body;

    // --- VALIDATION ---

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // --- FIND USER ---

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // --- CHECK PASSWORD ---

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // --- UPDATE USER STATS ---

    user.stats.lastActive = Date.now();
    user.stats.streak = (user.stats.streak || 0) + 1;
    user.lastLogin = Date.now();
    await user.save();

    // --- GENERATE TOKEN ---

    const token = generateToken(user._id);

    // --- SEND RESPONSE ---

    console.log('✅ User logged in:', email);

    res.json({
      success: true,
      message: 'Login successful! Welcome back! 🎉',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        stats: user.stats,
        createdAt: user.createdAt
      }
    });

  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server error during login'
    });
  }
};

// ============================================
// GET CURRENT USER CONTROLLER
// ============================================

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token') || req.header('Authorization');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    // Remove 'Bearer ' if present
    const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;

    // Verify token
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET || 'secretkey');

    // Find user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update last active
    user.stats.lastActive = Date.now();
    await user.save();

    res.json({
      success: true,
      user
    });

  } catch (err) {
    console.error('❌ GetMe Error:', err);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      message: err.message || 'Server error'
    });
  }
};

// ============================================
// EXPORT CONTROLLERS
// ============================================

module.exports = {
  register,
  login,
  getMe
};