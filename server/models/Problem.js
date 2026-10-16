const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    enum: ['LeetCode', 'GeeksforGeeks', 'HackerRank', 'Codeforces', 'Other'],
    default: 'LeetCode'
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  primaryPatternId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pattern'
  },
  secondaryPatternIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pattern'
  }],
  dataStructures: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    default: ''
  },
  patternIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pattern'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index to ensure unique platform + title combo or url
problemSchema.index({ platform: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('Problem', problemSchema);

