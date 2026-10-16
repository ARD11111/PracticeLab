const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const Pattern = require('../models/Pattern');
const UserProblemState = require('../models/UserProblemState');
const PracticeSession = require('../models/PracticeSession');

mongoose.connect('mongodb://127.0.0.1:27017/practicelab').then(async () => {
  const totalProblems = await Problem.countDocuments();
  const totalPatterns = await Pattern.countDocuments();
  const totalStates = await UserProblemState.countDocuments();
  const totalSessions = await PracticeSession.countDocuments();

  // Validate fields
  const probs = await Problem.find().populate('primaryPatternId').populate('secondaryPatternIds');
  let missingCategory = 0;
  let missingPrimaryPattern = 0;
  let invalidPrimaryPatternRef = 0;

  probs.forEach(p => {
    if (!p.category) missingCategory++;
    if (!p.primaryPatternId) missingPrimaryPattern++;
    else if (!p.primaryPatternId.name) invalidPrimaryPatternRef++;
  });

  console.log('=== VERIFICATION RESULTS ===');
  console.log(`- Total Problems in DB: ${totalProblems}`);
  console.log(`- Total Canonical Patterns: ${totalPatterns}`);
  console.log(`- Total User Problem States: ${totalStates}`);
  console.log(`- Total Practice Sessions: ${totalSessions}`);
  console.log(`- Problems missing category: ${missingCategory}`);
  console.log(`- Problems missing primary pattern: ${missingPrimaryPattern}`);
  console.log(`- Invalid primary pattern refs: ${invalidPrimaryPatternRef}`);

  mongoose.disconnect();
}).catch(console.error);
