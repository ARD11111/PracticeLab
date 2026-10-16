const nodemailer = require('nodemailer');

// Configure transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});

/**
 * Sends a daily practice reminder email to the specified user.
 */
async function sendDailyReminderEmail(toEmail, userName, dueCount, recommendedProblems = []) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const fromEmail = process.env.EMAIL_FROM || '"PracticeLab" <noreply@practicelab.dev>';

  const subject = `[PracticeLab] You have ${dueCount} problem(s) due for active recall review`;
  
  const recommendedListHtml = recommendedProblems.length > 0 
    ? recommendedProblems.map(p => `<li><strong>${p.title}</strong> (${p.difficulty} - ${p.platform})</li>`).join('')
    : '<li>Keep pushing forward on your core algorithm patterns!</li>';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #000; margin-top: 0;">PracticeLab Daily Review Reminder</h2>
      <p>Hello ${userName},</p>
      <p>Consistent pattern-based practice is the key to mastering algorithmic thinking.</p>
      
      <div style="background-color: #f4f4f5; padding: 15px; border: 1px solid #e5e7eb; border-radius: 6px; margin: 20px 0;">
        <h4 style="margin: 0 0 8px 0;">Today's Practice Overview:</h4>
        <p style="margin: 0; font-size: 16px;"><strong>${dueCount}</strong> problem(s) currently due for revision.</p>
      </div>

      <h4>Recommended Problems to Practice Today:</h4>
      <ul>
        ${recommendedListHtml}
      </ul>

      <div style="margin-top: 30px;">
        <a href="${clientUrl}/dashboard" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
          Open PracticeLab Queue
        </a>
      </div>

      <hr style="margin-top: 40px; border: 0; border-top: 1px solid #e5e7eb;" />
      <p style="font-size: 12px; color: #6b7280;">
        You are receiving this because you enabled daily reminders in PracticeLab. You can update your email preferences in Settings.
      </p>
    </div>
  `;

  try {
    const isPlaceholder = !process.env.EMAIL_USER || 
      process.env.EMAIL_USER === 'your_email@gmail.com' || 
      process.env.EMAIL_USER === 'demo@practicelab.dev' ||
      process.env.EMAIL_PASS === 'demo_password' ||
      process.env.EMAIL_PASS === 'your_app_password';

    if (isPlaceholder) {
      console.log(`[Mock Email Sent to ${toEmail}]: Subject: "${subject}" - Due: ${dueCount}`);
      return { success: true, mock: true };
    }

    const info = await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject,
      html
    });

    console.log(`[Email Sent to ${toEmail}]: Message ID ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Failed for ${toEmail}]:`, error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendDailyReminderEmail };
