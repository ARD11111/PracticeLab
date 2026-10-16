const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const Pattern = require('../models/Pattern');

mongoose.connect('mongodb://127.0.0.1:27017/practicelab').then(async () => {
  const bitPattern = await Pattern.findOne({ name: 'Bit Manipulation' });
  const probs = await Problem.find({
    $or: [
      { category: { $exists: false } },
      { category: '' },
      { primaryPatternId: { $exists: false } }
    ]
  });

  for (const p of probs) {
    p.category = p.category || 'Math & Geometry';
    p.primaryPatternId = p.primaryPatternId || bitPattern._id;
    if (!p.patternIds || p.patternIds.length === 0) {
      p.patternIds = [p.primaryPatternId];
    }
    await p.save();
    console.log(`Updated default fields for legacy problem: "${p.title}"`);
  }

  mongoose.disconnect();
}).catch(console.error);
