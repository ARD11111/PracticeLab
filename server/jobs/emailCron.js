const cron = require('node-cron');
const User = require('../models/User');
const UserProblemState = require('../models/UserProblemState');
const { getRecommendationsForUser } = require('../services/recommendationEngine');
const { sendDailyReminderEmail } = require('../services/mailerService');

function initEmailScheduler() {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron Job] Checking for due practice email reminders...');
    try {
      const now = new Date();
      const currentHourStr = now.getHours().toString().padStart(2, '0') + ':00';

      // Find users who have daily reminders enabled
      const users = await User.find({
        'settings.dailyReminder': true
      });

      for (const user of users) {
        // Match user's configured reminder time (or run once daily)
        const userTime = user.settings?.reminderTime || '09:00';
        const userHour = userTime.split(':')[0] + ':00';

        if (userHour === currentHourStr) {
          // Count due problems for this user
          const dueCount = await UserProblemState.countDocuments({
            userId: user._id,
            nextReview: { $lte: now },
            status: { $ne: 'Archived' }
          });

          if (dueCount > 0) {
            const recs = await getRecommendationsForUser(user._id, 3);
            const recommendedProblems = recs.map(r => r.problem);
            await sendDailyReminderEmail(user.email, user.name, dueCount, recommendedProblems);
          }
        }
      }
    } catch (error) {
      console.error('[Cron Error] Failed during email reminder check:', error);
    }
  });

  console.log('[Cron Scheduler] Daily practice email scheduler initialized.');
}

module.exports = { initEmailScheduler };
