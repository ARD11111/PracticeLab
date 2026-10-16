const Problem = require('../models/Problem');
const Pattern = require('../models/Pattern');
const UserProblemState = require('../models/UserProblemState');
const PracticeSession = require('../models/PracticeSession');

exports.detectProblem = async (req, res) => {
  try {
    const { url, title, platform, difficulty } = req.body;
    const userId = req.user ? req.user.userId : null;

    if (!url && !title) {
      return res.status(400).json({ message: 'URL or title is required.' });
    }

    // Try finding by exact URL or platform + title
    let problem = null;
    if (url) {
      // Standardize URL check by removing trailing slashes or query params
      const cleanUrl = url.split('?')[0].replace(/\/$/, '');
      problem = await Problem.findOne({
        url: { $regex: new RegExp(cleanUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i') }
      }).populate('patternIds');
    }

    if (!problem && title && platform) {
      problem = await Problem.findOne({
        title: { $regex: new RegExp(`^${title.trim()}$`, 'i') },
        platform: platform
      }).populate('patternIds');
    }

    let userState = null;
    let lastSession = null;

    if (problem && userId) {
      userState = await UserProblemState.findOne({ userId, problemId: problem._id });
      lastSession = await PracticeSession.findOne({ userId, problemId: problem._id })
        .sort({ createdAt: -1 })
        .populate('recognizedPatternId');
    }

    res.json({
      found: !!problem,
      problem: problem || {
        title: title || 'Detected Coding Problem',
        platform: platform || 'LeetCode',
        url: url || '',
        difficulty: difficulty || 'Easy',
        patternIds: []
      },
      userState: userState ? {
        status: userState.status,
        lastPracticedAt: userState.lastPracticedAt,
        nextReview: userState.nextReview
      } : null,
      lastSession: lastSession ? {
        date: lastSession.createdAt,
        confidence: lastSession.confidence,
        pattern: lastSession.recognizedPatternId?.name || 'Unspecified'
      } : null
    });
  } catch (error) {
    console.error('detectProblem Error:', error);
    res.status(500).json({ message: 'Error detecting problem from extension.' });
  }
};

exports.addOrGetFromExtension = async (req, res) => {
  try {
    const { title, platform, url, difficulty, patternName } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required.' });
    }

    const cleanUrl = url.split('?')[0].replace(/\/$/, '');

    // Robust search: normalized URL regex first, then exact title + platform
    let problem = await Problem.findOne({
      url: { $regex: new RegExp(cleanUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i') }
    }).populate('patternIds');

    if (!problem && title && platform) {
      problem = await Problem.findOne({
        title: { $regex: new RegExp(`^${title.trim()}$`, 'i') },
        platform: platform
      }).populate('patternIds');
    }

    if (!problem) {
      let patternIds = [];
      if (patternName) {
        let patternObj = await Pattern.findOne({ name: { $regex: new RegExp(patternName, 'i') } });
        if (patternObj) {
          patternIds.push(patternObj._id);
        }
      }

      const validDifficulty = ['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : 'Easy';
      const validPlatform = ['LeetCode', 'GeeksforGeeks', 'HackerRank', 'Codeforces', 'Other'].includes(platform) ? platform : 'Other';

      problem = new Problem({
        title: title.trim(),
        platform: validPlatform,
        url: cleanUrl,
        difficulty: validDifficulty,
        patternIds
      });
      await problem.save();
      problem = await Problem.findById(problem._id).populate('patternIds');
    }

    res.status(200).json({
      message: 'Problem matched or created via extension.',
      problem
    });
  } catch (error) {
    console.error('addOrGetFromExtension Error:', error);
    res.status(500).json({ message: 'Error processing extension problem request.' });
  }
};
