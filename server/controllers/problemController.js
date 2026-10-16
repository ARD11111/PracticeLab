const Problem = require('../models/Problem');
const Pattern = require('../models/Pattern');
const UserProblemState = require('../models/UserProblemState');
const PracticeSession = require('../models/PracticeSession');

exports.getProblems = async (req, res) => {
  try {
    const { category, pattern, difficulty, status, search } = req.query;
    const userId = req.user.userId;

    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    if (pattern && pattern !== 'All') {
      const patternObj = await Pattern.findOne({ name: pattern });
      if (patternObj) {
        filter.$or = [
          { primaryPatternId: patternObj._id },
          { secondaryPatternIds: patternObj._id },
          { patternIds: patternObj._id }
        ];
      }
    }

    if (search && search.trim()) {
      const searchStr = search.trim();
      const flexSearch = searchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '[\\s_-]*');
      const searchRegex = new RegExp(flexSearch, 'i');

      const matchingPatterns = await Pattern.find({ name: searchRegex });
      const matchingPatternIds = matchingPatterns.map(p => p._id);

      const searchConditions = [
        { title: searchRegex },
        { category: searchRegex },
        { dataStructures: searchRegex },
        { description: searchRegex }
      ];

      if (matchingPatternIds.length > 0) {
        searchConditions.push(
          { primaryPatternId: { $in: matchingPatternIds } },
          { secondaryPatternIds: { $in: matchingPatternIds } },
          { patternIds: { $in: matchingPatternIds } }
        );
      }

      if (filter.$or) {
        const existingOr = filter.$or;
        delete filter.$or;
        filter.$and = [
          { $or: existingOr },
          { $or: searchConditions }
        ];
      } else {
        filter.$or = searchConditions;
      }
    }

    let problems = await Problem.find(filter)
      .populate('primaryPatternId')
      .populate('secondaryPatternIds')
      .populate('patternIds')
      .sort({ createdAt: -1 });

    // Attach user-specific state to each problem
    const userStates = await UserProblemState.find({ userId });
    const stateMap = {};
    userStates.forEach(s => {
      if (s.problemId) {
        stateMap[s.problemId.toString()] = s;
      }
    });

    let result = problems.map(prob => {
      const state = stateMap[prob._id.toString()];
      const probStatus = state ? state.status : 'Not Practiced';
      const isDue = state && state.nextReview && new Date(state.nextReview) <= new Date() && state.status !== 'Archived';
      
      return {
        ...prob.toObject(),
        userState: state ? {
          status: probStatus,
          nextReview: state.nextReview,
          interval: state.interval,
          lastPracticedAt: state.lastPracticedAt,
          isDue
        } : {
          status: 'Not Practiced',
          nextReview: null,
          interval: 0,
          lastPracticedAt: null,
          isDue: false
        }
      };
    });

    if (status && status !== 'All') {
      if (status === 'Due') {
        result = result.filter(p => p.userState.isDue);
      } else {
        result = result.filter(p => p.userState.status === status);
      }
    }

    res.json(result);
  } catch (error) {
    console.error('getProblems Error:', error);
    res.status(500).json({ message: 'Error fetching problems.' });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const problem = await Problem.findById(id)
      .populate('primaryPatternId')
      .populate('secondaryPatternIds')
      .populate('patternIds');
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found.' });
    }

    const userState = await UserProblemState.findOne({ userId, problemId: id });
    const history = await PracticeSession.find({ userId, problemId: id })
      .sort({ createdAt: -1 })
      .populate('recognizedPatternId');

    res.json({
      problem,
      userState: userState || { status: 'Not Practiced', reviewCount: 0 },
      history
    });
  } catch (error) {
    console.error('getProblemById Error:', error);
    res.status(500).json({ message: 'Error fetching problem details.' });
  }
};

exports.createProblem = async (req, res) => {
  try {
    const { title, platform, url, difficulty, patternIds, description } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required.' });
    }

    // Normalize platform
    const platformName = platform || 'LeetCode';

    let existingProblem = await Problem.findOne({
      $or: [{ url: url.trim() }, { title: title.trim(), platform: platformName }]
    });

    if (existingProblem) {
      return res.status(200).json({
        message: 'Problem already exists in catalog.',
        problem: existingProblem
      });
    }

    const newProblem = new Problem({
      title: title.trim(),
      platform: platformName,
      url: url.trim(),
      difficulty: difficulty || 'Easy',
      description: description || '',
      patternIds: patternIds || []
    });

    await newProblem.save();
    const populated = await Problem.findById(newProblem._id).populate('patternIds');

    res.status(201).json({
      message: 'Problem created successfully.',
      problem: populated
    });
  } catch (error) {
    console.error('createProblem Error:', error);
    res.status(500).json({ message: 'Error creating problem.' });
  }
};
