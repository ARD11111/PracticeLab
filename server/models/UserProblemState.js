const mongoose = require('mongoose');

const userProblemStateSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['Not Practiced', 'Practiced', 'Due', 'Mastered', 'Archived'],
    default: 'Practiced'
  },
  nextReview: {
    type: Date,
    default: Date.now
  },
  interval: {
    type: Number,
    default: 1
  },
  easeFactor: {
    type: Number,
    default: 2.5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  lastPracticedAt: {
    type: Date,
    default: Date.now
  }
});

userProblemStateSchema.index({ userId: 1, problemId: 1 }, { unique: true });

module.exports = mongoose.model('UserProblemState', userProblemStateSchema);
