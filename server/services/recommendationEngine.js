const Problem = require('../models/Problem');
const Pattern = require('../models/Pattern');
const UserProblemState = require('../models/UserProblemState');
const PracticeSession = require('../models/PracticeSession');

/**
 * Recommends problems based on user practice history, pattern performance, and difficulty progression.
 */
async function getRecommendationsForUser(userId, limit = 6) {
  // Fetch user practice states and recent sessions
  const states = await UserProblemState.find({ userId });
  const practicedProblemIds = states.map(s => s.problemId.toString());
  
  const recentSessions = await PracticeSession.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate({
      path: 'problemId',
      populate: { path: 'patternIds' }
    });

  // Calculate pattern performance scores
  const patternStats = {}; // patternId -> { total: 0, high: 0, medium: 0, low: 0, patternName: '' }

  recentSessions.forEach(session => {
    if (!session.problemId || !session.problemId.patternIds) return;
    session.problemId.patternIds.forEach(pattern => {
      const pId = pattern._id.toString();
      if (!patternStats[pId]) {
        patternStats[pId] = { total: 0, high: 0, medium: 0, low: 0, name: pattern.name };
      }
      patternStats[pId].total += 1;
      if (session.confidence === 'High') patternStats[pId].high += 1;
      else if (session.confidence === 'Medium') patternStats[pId].medium += 1;
      else patternStats[pId].low += 1;
    });
  });

  // Fetch all patterns to ensure coverage
  const allPatterns = await Pattern.find();
  const patternList = allPatterns.map(p => p._id.toString());

  // Target patterns: prioritized by (1) weak performance, (2) actively practicing, (3) unexplored
  let targetPatternId = null;
  let targetPatternName = '';
  let reasonTemplate = '';

  // Check weak pattern first
  for (const [pId, stats] of Object.entries(patternStats)) {
    const mastery = ((stats.high * 1.0 + stats.medium * 0.5) / stats.total) * 100;
    if (mastery < 60) {
      targetPatternId = pId;
      targetPatternName = stats.name;
      reasonTemplate = `Recommended to strengthen your application of the ${stats.name} pattern where your current confidence needs improvement.`;
      break;
    }
  }

  // If no weak pattern, check active improving pattern
  if (!targetPatternId && recentSessions.length > 0) {
    const lastSession = recentSessions[0];
    if (lastSession.problemId && lastSession.problemId.patternIds && lastSession.problemId.patternIds.length > 0) {
      const p = lastSession.problemId.patternIds[0];
      targetPatternId = p._id.toString();
      targetPatternName = p.name;
      reasonTemplate = `Recommended because your ${p.name} confidence is improving and this problem provides a step-up challenge of the same pattern.`;
    }
  }

  // Fallback to random unexplored pattern if needed
  if (!targetPatternId && allPatterns.length > 0) {
    const p = allPatterns[Math.floor(Math.random() * allPatterns.length)];
    targetPatternId = p._id.toString();
    targetPatternName = p.name;
    reasonTemplate = `Recommended to broaden your algorithmic repertoire with a classic ${p.name} problem.`;
  }

  // Fetch candidate unpracticed problems for target pattern first
  let candidates = [];

  if (targetPatternId) {
    candidates = await Problem.find({
      _id: { $nin: practicedProblemIds },
      patternIds: targetPatternId
    }).populate('patternIds').limit(limit);
  }

  // If not enough candidate problems in target pattern, fetch from all unpracticed problems
  if (candidates.length < limit) {
    const remainingLimit = limit - candidates.length;
    const extraIds = candidates.map(c => c._id.toString());
    const additional = await Problem.find({
      _id: { $nin: [...practicedProblemIds, ...extraIds] }
    }).populate('patternIds').limit(remainingLimit);

    candidates = [...candidates, ...additional];
  }

  // Format final recommendations list with explanations
  const recommendations = candidates.map(prob => {
    const primaryPattern = prob.patternIds && prob.patternIds.length > 0 ? prob.patternIds[0].name : 'General DSA';
    const reason = targetPatternName && prob.patternIds?.some(p => p.name === targetPatternName)
      ? reasonTemplate
      : `Recommended because your mastery in ${primaryPattern} is growing and practicing diverse ${prob.difficulty} problems prevents memory reliance.`;

    return {
      _id: prob._id,
      problem: prob,
      pattern: primaryPattern,
      difficulty: prob.difficulty,
      platform: prob.platform,
      reason
    };
  });

  return recommendations;
}

module.exports = { getRecommendationsForUser };
