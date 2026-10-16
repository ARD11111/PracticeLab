const { getRecommendationsForUser } = require('../services/recommendationEngine');

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recommendations = await getRecommendationsForUser(userId, 8);
    res.json(recommendations);
  } catch (error) {
    console.error('getRecommendations Error:', error);
    res.status(500).json({ message: 'Error generating adaptive recommendations.' });
  }
};
