const PracticeSession = require('../models/PracticeSession');
const UserProblemState = require('../models/UserProblemState');
const Pattern = require('../models/Pattern');

async function getUserAnalytics(userId) {
  const sessions = await PracticeSession.find({ userId })
    .sort({ createdAt: -1 })
    .populate({
      path: 'problemId',
      populate: { path: 'patternIds' }
    });

  const states = await UserProblemState.find({ userId }).populate('problemId');

  const totalPracticed = states.filter(s => s.status !== 'Not Practiced').length;
  const totalMastered = states.filter(s => s.status === 'Mastered').length;

  // Streak calculation
  let streak = 0;
  if (sessions.length > 0) {
    const dates = sessions.map(s => new Date(s.createdAt).toISOString().split('T')[0]);
    const uniqueDates = [...new Set(dates)].sort().reverse();

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (uniqueDates.includes(todayStr) || uniqueDates.includes(yesterdayStr)) {
      let currentDate = new Date(uniqueDates[0]);
      streak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prev = new Date(uniqueDates[i]);
        const diffDays = Math.round((currentDate - prev) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          streak += 1;
          currentDate = prev;
        } else {
          break;
        }
      }
    }
  }

  // Pattern Mastery Breakdown
  const allPatterns = await Pattern.find();
  const patternStats = {}; // patternId -> { name, total: 0, high: 0, medium: 0, low: 0, lastPracticed: null }

  allPatterns.forEach(p => {
    patternStats[p._id.toString()] = {
      id: p._id,
      name: p.name,
      total: 0,
      high: 0,
      medium: 0,
      low: 0,
      lastPracticed: null,
      mastery: 0
    };
  });

  sessions.forEach(sess => {
    if (!sess.problemId || !sess.problemId.patternIds) return;
    sess.problemId.patternIds.forEach(pat => {
      const pId = pat._id ? pat._id.toString() : pat.toString();
      if (patternStats[pId]) {
        patternStats[pId].total += 1;
        if (sess.confidence === 'High') patternStats[pId].high += 1;
        else if (sess.confidence === 'Medium') patternStats[pId].medium += 1;
        else patternStats[pId].low += 1;

        if (!patternStats[pId].lastPracticed || new Date(sess.createdAt) > new Date(patternStats[pId].lastPracticed)) {
          patternStats[pId].lastPracticed = sess.createdAt;
        }
      }
    });
  });

  const strongPatterns = [];
  const weakPatterns = [];

  Object.values(patternStats).forEach(stat => {
    if (stat.total > 0) {
      const score = ((stat.high * 1.0 + stat.medium * 0.5) / stat.total) * 100;
      stat.mastery = Math.round(score);
    } else {
      stat.mastery = 0;
    }

    if (stat.total > 0) {
      if (stat.mastery >= 70) {
        strongPatterns.push(stat);
      } else {
        weakPatterns.push(stat);
      }
    }
  });

  // Heatmap data (activity per date)
  const activityMap = {};
  sessions.forEach(s => {
    const d = new Date(s.createdAt).toISOString().split('T')[0];
    activityMap[d] = (activityMap[d] || 0) + 1;
  });

  return {
    totalPracticed,
    totalMastered,
    streak,
    totalSessions: sessions.length,
    patternStats: Object.values(patternStats),
    strongPatterns,
    weakPatterns,
    activityMap
  };
}

module.exports = { getUserAnalytics };
