const { getUserAnalytics } = require('../services/analyticsService');

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const analytics = await getUserAnalytics(userId);
    res.json(analytics);
  } catch (error) {
    console.error('getAnalytics Error:', error);
    res.status(500).json({ message: 'Error retrieving learning analytics.' });
  }
};
