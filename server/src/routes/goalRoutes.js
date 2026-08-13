const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Goal = require('../models/Goal');

// All routes require authentication
router.use(auth);

// GET all goals for current user
router.get('/', async (req, res) => {
  try {
    console.log('📊 Fetching goals for user:', req.user._id);
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log(`✅ Found ${goals.length} goals`);
    res.json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (err) {
    console.error('❌ Get Goals Error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to load goals'
    });
  }
});

// POST create new goal
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating goal for user:', req.user._id);
    const goal = await Goal.create({
      ...req.body,
      user: req.user._id
    });
    console.log('✅ Goal created:', goal.title);
    res.status(201).json({
      success: true,
      data: goal
    });
  } catch (err) {
    console.error('❌ Create Goal Error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create goal'
    });
  }
});

// PUT update goal
router.put('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }
    res.json({
      success: true,
      data: goal
    });
  } catch (err) {
    console.error('❌ Update Goal Error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update goal'
    });
  }
});

// DELETE goal
router.delete('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }
    res.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (err) {
    console.error('❌ Delete Goal Error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to delete goal'
    });
  }
});

module.exports = router;