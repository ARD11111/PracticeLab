const PracticeSession = require('../models/PracticeSession');
const UserProblemState = require('../models/UserProblemState');
const User = require('../models/User');
const Problem = require('../models/Problem');
const { calculateNextReview } = require('../services/sm2');
const { getRecommendationsForUser } = require('../services/recommendationEngine');

exports.createSession = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      problemId,
      recognizedPatternId,
      reasoning,
      keyIdea,
      mistake,
      recognitionClues,
      confidence
    } = req.body;

    if (!problemId || !confidence) {
      return res.status(400).json({ message: 'Problem ID and confidence score are required.' });
    }

    // 1. Create PracticeSession record
    const session = new PracticeSession({
      userId,
      problemId,
      recognizedPatternId: recognizedPatternId || null,
      reasoning: reasoning || '',
      keyIdea: keyIdea || '',
      mistake: mistake || '',
      recognitionClues: recognitionClues || '',
      confidence
    });
    await session.save();

    // 2. Fetch or create UserProblemState
    let state = await UserProblemState.findOne({ userId, problemId });
    if (!state) {
      state = new UserProblemState({
        userId,
        problemId,
        status: 'Practiced',
        interval: 1,
        easeFactor: 2.5,
        reviewCount: 0
      });
    }

    // 3. Compute SM-2 update
    const sm2Result = calculateNextReview(
      confidence,
      state.interval,
      state.easeFactor,
      state.reviewCount
    );

    state.nextReview = sm2Result.nextReview;
    state.interval = sm2Result.interval;
    state.easeFactor = sm2Result.easeFactor;
    state.reviewCount = sm2Result.reviewCount;
    state.status = state.status === 'Archived' ? 'Archived' : sm2Result.status;
    state.lastPracticedAt = new Date();

    await state.save();

    // 4. Update User streak
    const user = await User.findById(userId);
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toISOString().split('T')[0] : null;

      if (!lastActive) {
        user.streakCount = 1;
      } else if (lastActive !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastActive === yesterdayStr) {
          user.streakCount += 1;
        } else {
          user.streakCount = 1;
        }
      }
      user.lastActiveDate = new Date();
      await user.save();
    }

    // 5. Get recommended next problem
    const recommendations = await getRecommendationsForUser(userId, 1);
    const recommendedNext = recommendations.length > 0 ? recommendations[0] : null;

    res.status(201).json({
      message: 'Practice session completed successfully!',
      session,
      userProblemState: state,
      recommendedNext
    });
  } catch (error) {
    console.error('createSession Error:', error);
    res.status(500).json({ message: 'Error saving practice session.' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const history = await PracticeSession.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'problemId',
        populate: { path: 'patternIds' }
      })
      .populate('recognizedPatternId');

    res.json(history);
  } catch (error) {
    console.error('getHistory Error:', error);
    res.status(500).json({ message: 'Error fetching practice history.' });
  }
};
