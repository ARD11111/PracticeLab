const mongoose = require('mongoose');

const practiceSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  recognizedPatternId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pattern'
  },
  reasoning: {
    type: String,
    default: ''
  },
  keyIdea: {
    type: String,
    default: ''
  },
  mistake: {
    type: String,
    default: ''
  },
  recognitionClues: {
    type: String,
    default: ''
  },
  confidence: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PracticeSession', practiceSessionSchema);
