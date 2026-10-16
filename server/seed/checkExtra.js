const mongoose = require('mongoose');
const { canonicalProblems } = require('./canonicalData');

mongoose.connect('mongodb://127.0.0.1:27017/practicelab').then(async () => {
  const Problem = mongoose.model('Problem', new mongoose.Schema({}, { strict: false }));
  const PracticeSession = mongoose.model('PracticeSession', new mongoose.Schema({}, { strict: false }));
  const UserProblemState = mongoose.model('UserProblemState', new mongoose.Schema({}, { strict: false }));

  const canonicalTitles = new Set(canonicalProblems.map(p => p.title.toLowerCase().trim()));
  const allProbs = await Problem.find();
  const nonCanonical = allProbs.filter(p => !canonicalTitles.has(p.title.toLowerCase().trim()));

  console.log('Non-canonical problems found:', nonCanonical.length);
  for (const p of nonCanonical) {
    const sessCount = await PracticeSession.countDocuments({ problemId: p._id });
    const stateCount = await UserProblemState.countDocuments({ problemId: p._id });
    console.log(`- Title: "${p.title}" | Sessions: ${sessCount} | UserStates: ${stateCount}`);
    
    // If no user practice history references this non-canonical problem, clean it up so canonical count is exactly 150!
    if (sessCount === 0 && stateCount === 0) {
      await Problem.deleteOne({ _id: p._id });
      console.log(`  -> Removed unreferenced non-canonical problem "${p.title}"`);
    }
  }

  const finalCount = await Problem.countDocuments();
  console.log(`Final Problem Count in DB: ${finalCount}`);

  mongoose.disconnect();
}).catch(console.error);
