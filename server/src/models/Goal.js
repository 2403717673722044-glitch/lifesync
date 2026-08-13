const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['Career', 'Health', 'Finance', 'Relationships', 'Personal Growth', 'Education', 'Other'],
    required: true
  },
  targetDate: {
    type: Date,
    required: true
  },
  currentProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  milestones: [{
    title: String,
    completed: {
      type: Boolean,
      default: false
    },
    date: Date
  }],
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'On Hold', 'Completed', 'Abandoned'],
    default: 'Not Started'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  isHabit: {
    type: Boolean,
    default: false
  },
  habitFrequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly'],
    default: 'Daily'
  },
  habitStreak: {
    type: Number,
    default: 0
  },
  habitHistory: [{
    date: Date,
    completed: Boolean
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Goal', GoalSchema);