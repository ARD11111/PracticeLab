const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(__dirname, '../../.env') });
}

const Pattern = require('../models/Pattern');
const Problem = require('../models/Problem');
const User = require('../models/User');
const PracticeSession = require('../models/PracticeSession');
const UserProblemState = require('../models/UserProblemState');
const { canonicalCategories, canonicalPatterns, canonicalProblems } = require('./canonicalData');

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/practicelab';
    console.log(`[Seed Script] Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seed Script] Syncing 48 Canonical Algorithmic Patterns...');
    const patternMap = {};
    for (const p of canonicalPatterns) {
      let doc = await Pattern.findOne({ name: p.name });
      if (!doc) {
        doc = await Pattern.create({
          name: p.name,
          slug: p.slug,
          category: p.category || 'Algorithmic Pattern',
          categoryOrder: p.categoryOrder || 99,
          learningOrder: p.learningOrder || 99,
          section: p.section || 'FOUNDATION',
          description: p.description
        });
      } else {
        doc.slug = p.slug;
        doc.category = p.category || doc.category;
        doc.categoryOrder = p.categoryOrder || doc.categoryOrder;
        doc.learningOrder = p.learningOrder || doc.learningOrder;
        doc.section = p.section || doc.section;
        doc.description = p.description;
        await doc.save();
      }
      patternMap[p.name] = doc._id;
    }

    console.log('[Seed Script] Syncing 150 Canonical Problems...');
    for (const probSpec of canonicalProblems) {
      const primaryPatternId = patternMap[probSpec.primaryPattern];
      const secondaryPatternIds = (probSpec.secondaryPatterns || [])
        .map(secName => patternMap[secName])
        .filter(Boolean);

      const patternIds = [primaryPatternId, ...secondaryPatternIds.filter(id => id && id.toString() !== primaryPatternId.toString())];
      const normTitle = probSpec.title.trim();

      await Problem.findOneAndUpdate(
        { title: { $regex: new RegExp(`^${normTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        {
          title: probSpec.title,
          platform: 'LeetCode',
          url: probSpec.url,
          difficulty: probSpec.difficulty,
          category: probSpec.category,
          primaryPatternId,
          secondaryPatternIds,
          dataStructures: probSpec.dataStructures || [],
          patternIds
        },
        { upsert: true, new: true }
      );
    }

    console.log(`[Seed Script] Successfully synced ${canonicalPatterns.length} algorithmic patterns and ${canonicalProblems.length} canonical problems!`);

    // Ensure default demo user exists
    const demoEmail = 'demo@practicelab.dev';
    let demoUser = await User.findOne({ email: demoEmail });
    if (!demoUser) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password123', salt);
      demoUser = new User({
        name: 'Demo Algorithmic Student',
        email: demoEmail,
        passwordHash
      });
      await demoUser.save();
      console.log(`[Seed Script] Created default demo user: ${demoEmail} / password123`);
    }

    // Seed initial practice history if needed for demo user
    const validPal = await Problem.findOne({ title: 'Valid Palindrome' });
    const twoSumSorted = await Problem.findOne({ title: 'Two Sum II - Input Array Is Sorted' });

    if (validPal && demoUser) {
      const existingSession = await PracticeSession.findOne({ userId: demoUser._id, problemId: validPal._id });
      if (!existingSession) {
        await PracticeSession.create({
          userId: demoUser._id,
          problemId: validPal._id,
          recognizedPatternId: patternMap['Two Pointers'],
          reasoning: 'Compare start and end pointers inward.',
          keyIdea: 'Two pointers left and right, skip non-alphanumeric.',
          mistake: 'Missed lowercased character conversion.',
          recognitionClues: 'Palindrome string checking.',
          confidence: 'High'
        });

        await UserProblemState.findOneAndUpdate(
          { userId: demoUser._id, problemId: validPal._id },
          {
            userId: demoUser._id,
            problemId: validPal._id,
            status: 'Due',
            nextReview: new Date(Date.now() - 1 * 60 * 60 * 1000),
            interval: 1,
            easeFactor: 2.36,
            reviewCount: 1,
            lastPracticedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          { upsert: true }
        );
      }
    }

    if (twoSumSorted && demoUser) {
      const existingSession = await PracticeSession.findOne({ userId: demoUser._id, problemId: twoSumSorted._id });
      if (!existingSession) {
        await PracticeSession.create({
          userId: demoUser._id,
          problemId: twoSumSorted._id,
          recognizedPatternId: patternMap['Two Pointers'],
          reasoning: 'Sorted array allows left/right sum adjustment.',
          keyIdea: 'If sum < target left++, if sum > target right--.',
          mistake: '1-indexed output conversion.',
          recognitionClues: 'Sorted array target sum.',
          confidence: 'Medium'
        });

        await UserProblemState.findOneAndUpdate(
          { userId: demoUser._id, problemId: twoSumSorted._id },
          {
            userId: demoUser._id,
            problemId: twoSumSorted._id,
            status: 'Practiced',
            nextReview: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            interval: 3,
            easeFactor: 2.5,
            reviewCount: 1,
            lastPracticedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          },
          { upsert: true }
        );
      }
    }

    console.log('[Seed Script] Seeding complete! Closing MongoDB connection...');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Script Error]:', error);
    process.exit(1);
  }
}

seedDatabase();
