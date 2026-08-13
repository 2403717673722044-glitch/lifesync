const mongoose = require('mongoose');

const DiarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    enum: ['😊 Happy', '😢 Sad', '😡 Angry', '😌 Calm', '🤔 Thoughtful', '🥰 Grateful', '😰 Anxious', '😴 Tired', '💪 Motivated', '🤗 Loved'],
    default: '😊 Happy'
  },
  tags: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String
  }],
  isPrivate: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Diary', DiarySchema);