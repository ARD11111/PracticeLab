const UserProblemState = require('../models/UserProblemState');

exports.getReviewQueue = async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();

    const states = await UserProblemState.find({ userId, status: { $ne: 'Archived' } })
      .populate({
        path: 'problemId',
        populate: { path: 'patternIds' }
      })
      .sort({ nextReview: 1 });

    const dueToday = [];
    const upcoming = [];
    const completed = [];

    states.forEach(state => {
      if (!state.problemId) return;

      const nextRev = new Date(state.nextReview);
      if (nextRev <= now) {
        if (dueToday.length < 10) { // Limit active queue for focus
          dueToday.push(state);
        } else {
          upcoming.push(state);
        }
      } else if (state.status === 'Mastered') {
        completed.push(state);
      } else {
        upcoming.push(state);
      }
    });

    res.json({
      dueToday,
      upcoming,
      completed,
      dueTodayCount: dueToday.length,
      upcomingCount: upcoming.length,
      completedCount: completed.length
    });
  } catch (error) {
    console.error('getReviewQueue Error:', error);
    res.status(500).json({ message: 'Error fetching review queue.' });
  }
};

exports.toggleArchive = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { problemId } = req.params;

    let state = await UserProblemState.findOne({ userId, problemId });
    if (!state) {
      state = new UserProblemState({
        userId,
        problemId,
        status: 'Archived'
      });
    } else {
      state.status = state.status === 'Archived' ? 'Practiced' : 'Archived';
    }

    await state.save();

    res.json({
      message: `Problem ${state.status === 'Archived' ? 'archived' : 'restored'} successfully.`,
      userState: state
    });
  } catch (error) {
    console.error('toggleArchive Error:', error);
    res.status(500).json({ message: 'Error toggling archive status.' });
  }
};
