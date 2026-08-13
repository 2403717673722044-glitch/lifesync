const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @desc    Get all users (admin only - for future)
// @route   GET /api/users
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
  try {
    // For now, only return user count
    const count = await User.countDocuments();
    res.json({
      success: true,
      count
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;