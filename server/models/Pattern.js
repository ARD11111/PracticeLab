const mongoose = require('mongoose');

const patternSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'Algorithmic Pattern'
  },
  categoryOrder: {
    type: Number,
    default: 99
  },
  learningOrder: {
    type: Number,
    default: 99
  },
  section: {
    type: String,
    default: 'FOUNDATION'
  },
  prerequisites: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pattern', patternSchema);


