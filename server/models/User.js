const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  settings: {
    dailyReminder: { type: Boolean, default: true },
    reviewReminder: { type: Boolean, default: true },
    weeklyProgress: { type: Boolean, default: false },
    reminderTime: { type: String, default: "09:00" }
  },
  streakCount: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
