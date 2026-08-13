const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Diary = require('../models/Diary');

// All routes require authentication
router.use(auth);

// Get all diary entries
router.get('/', async (req, res) => {
  try {
    const entries = await Diary.find({ user: req.user._id }).sort({ date: -1 });
    res.json({ success: true, count: entries.length, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create diary entry
router.post('/', async (req, res) => {
  try {
    const entry = await Diary.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single diary entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await Diary.findOne({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    res.json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update diary entry
router.put('/:id', async (req, res) => {
  try {
    const entry = await Diary.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    res.json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete diary entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Diary.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    res.json({ success: true, message: 'Entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;