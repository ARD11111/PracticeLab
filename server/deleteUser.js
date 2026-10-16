const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const UserProblemState = require('./models/UserProblemState');
const PracticeSession = require('./models/PracticeSession');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/practicelab';

async function main() {
  const args = process.argv.slice(2);

  try {
    await mongoose.connect(MONGO_URI);
    console.log(`[MongoDB] Connected to database.`);

    if (args.length === 0) {
      console.log('\n--- Current Registered Users ---');
      const users = await User.find({}, 'name email createdAt');
      if (users.length === 0) {
        console.log('No registered users found in the database.');
      } else {
        users.forEach((u, i) => {
          console.log(`${i + 1}. Name: ${u.name} | Email: ${u.email} | ID: ${u._id}`);
        });
        console.log('\nTo delete specific users, run:');
        console.log('  node deleteUser.js user1@email.com user2@email.com');
        console.log('To delete ALL users, run:');
        console.log('  node deleteUser.js --all');
      }
      process.exit(0);
    }

    let targetUsers = [];
    if (args.includes('--all')) {
      targetUsers = await User.find({});
    } else {
      const lowerEmails = args.map(e => e.toLowerCase().trim());
      targetUsers = await User.find({ email: { $in: lowerEmails } });
    }

    if (targetUsers.length === 0) {
      console.log('No matching user accounts found for the provided email(s).');
      process.exit(0);
    }

    for (const user of targetUsers) {
      const userId = user._id;
      const statesDeleted = await UserProblemState.deleteMany({ userId });
      const sessionsDeleted = await PracticeSession.deleteMany({ userId });
      await User.deleteOne({ _id: userId });

      console.log(`Successfully deleted user: ${user.email} (${user.name})`);
      console.log(`  - Deleted ${statesDeleted.deletedCount} user problem state records.`);
      console.log(`  - Deleted ${sessionsDeleted.deletedCount} practice session records.`);
    }

    console.log('\nCleanup complete! You can now re-register with these email addresses.');
  } catch (err) {
    console.error('Error during deletion:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
