const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const UserProblemState = require('../models/UserProblemState');
const { getRecommendationsForUser } = require('../services/recommendationEngine');
const { sendDailyReminderEmail } = require('../services/mailerService');

router.post('/test-email', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const dueCount = await UserProblemState.countDocuments({
      userId,
      status: { $ne: 'Archived' }
    });

    const recs = await getRecommendationsForUser(userId, 3);
    const recommendedProblems = recs.map(r => r.problem);

    const result = await sendDailyReminderEmail(user.email, user.name, dueCount, recommendedProblems);
    res.json({
      message: 'Test email processed successfully.',
      result
    });
  } catch (error) {
    console.error('Test Email Error:', error);
    res.status(500).json({ message: 'Error sending test email.' });
  }
});

module.exports = router;
