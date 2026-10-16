const mongoose = require('mongoose');
const Pattern = require('../models/Pattern');
const Problem = require('../models/Problem');

mongoose.connect('mongodb://127.0.0.1:27017/practicelab').then(async () => {
  const patterns = await Pattern.find().sort({ categoryOrder: 1, learningOrder: 1 });
  console.log('Total patterns in DB:', patterns.length);

  const categoriesSet = new Set(patterns.map(p => p.category));
  console.log('Categories found in DB patterns:', Array.from(categoriesSet));

  const totalProblems = await Problem.countDocuments();
  console.log('Total Canonical Problems in DB:', totalProblems);

  mongoose.disconnect();
}).catch(console.error);
