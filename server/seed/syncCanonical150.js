const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(__dirname, '../../.env') });
}

const Pattern = require('../models/Pattern');
const Problem = require('../models/Problem');
const PracticeSession = require('../models/PracticeSession');
const UserProblemState = require('../models/UserProblemState');
const { canonicalCategories, canonicalPatterns, canonicalProblems } = require('./canonicalData');

async function syncCanonicalDataset() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/practicelab';
    console.log(`[Sync Script] Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    const initialProblemCount = await Problem.countDocuments();
    console.log(`[Sync Script] Number of problems found before update: ${initialProblemCount}`);

    // 1. Sync Canonical Algorithmic Patterns
    console.log('[Sync Script] Syncing 48 Canonical Algorithmic Patterns...');
    const patternMap = {}; // patternName -> Pattern ObjectId
    let patternsCreated = 0;

    for (const p of canonicalPatterns) {
      let doc = await Pattern.findOne({ name: p.name });
      if (!doc) {
        doc = await Pattern.create({
          name: p.name,
          slug: p.slug,
          category: 'Algorithmic Pattern',
          description: p.description
        });
        patternsCreated++;
      } else {
        doc.slug = p.slug;
        doc.description = p.description;
        await doc.save();
      }
      patternMap[p.name] = doc._id;
    }

    console.log(`[Sync Script] Canonical patterns ready. (${patternsCreated} new patterns created)`);

    // Remove legacy/deprecated pattern documents that are not in canonicalPatterns
    const canonicalNames = canonicalPatterns.map(p => p.name);
    const obsoletePatterns = await Pattern.find({ name: { $nin: canonicalNames } });
    
    if (obsoletePatterns.length > 0) {
      console.log(`[Sync Script] Found ${obsoletePatterns.length} obsolete patterns. Cleaning up references...`);
      for (const obs of obsoletePatterns) {
        // Fallback matching to canonical pattern if possible
        const matchedName = canonicalNames.find(c => c.toLowerCase().includes(obs.name.toLowerCase()) || obs.name.toLowerCase().includes(c.toLowerCase()));
        if (matchedName && patternMap[matchedName]) {
          await PracticeSession.updateMany(
            { recognizedPatternId: obs._id },
            { recognizedPatternId: patternMap[matchedName] }
          );
        }
        await Pattern.deleteOne({ _id: obs._id });
      }
    }

    // 2. Upsert the 150 Canonical Problems
    let newProblemsAdded = 0;
    let existingProblemsUpdated = 0;
    let duplicatesPrevented = 0;

    const canonicalTitlesSet = new Set(canonicalProblems.map(p => p.title.toLowerCase().trim()));

    for (const probSpec of canonicalProblems) {
      const primaryPatternId = patternMap[probSpec.primaryPattern];
      if (!primaryPatternId) {
        console.error(`[Error] Primary pattern missing for: ${probSpec.title} (${probSpec.primaryPattern})`);
        continue;
      }

      const secondaryPatternIds = (probSpec.secondaryPatterns || [])
        .map(secName => patternMap[secName])
        .filter(Boolean);

      // Combine primary + secondary for patternIds backward compatibility
      const patternIds = [primaryPatternId, ...secondaryPatternIds.filter(id => id.toString() !== primaryPatternId.toString())];

      const normTitle = probSpec.title.trim();

      // Find by title (case-insensitive) or URL
      const matches = await Problem.find({
        $or: [
          { title: { $regex: new RegExp(`^${normTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
          { url: probSpec.url }
        ]
      });

      let targetProblem = null;
      if (matches.length > 0) {
        targetProblem = matches[0];
        // If multiple matches exist (duplicates), merge/delete extra duplicates
        if (matches.length > 1) {
          for (let i = 1; i < matches.length; i++) {
            const extra = matches[i];
            // Re-point practice sessions and user state to targetProblem
            await PracticeSession.updateMany({ problemId: extra._id }, { problemId: targetProblem._id });
            await UserProblemState.updateMany({ problemId: extra._id }, { problemId: targetProblem._id });
            await Problem.deleteOne({ _id: extra._id });
            duplicatesPrevented++;
          }
        }
      }

      if (targetProblem) {
        // Update existing problem without breaking _id reference
        targetProblem.title = probSpec.title;
        targetProblem.platform = 'LeetCode';
        targetProblem.url = probSpec.url;
        targetProblem.difficulty = probSpec.difficulty;
        targetProblem.category = probSpec.category;
        targetProblem.primaryPatternId = primaryPatternId;
        targetProblem.secondaryPatternIds = secondaryPatternIds;
        targetProblem.dataStructures = probSpec.dataStructures || [];
        targetProblem.patternIds = patternIds;
        await targetProblem.save();
        existingProblemsUpdated++;
      } else {
        // Create new problem
        await Problem.create({
          title: probSpec.title,
          platform: 'LeetCode',
          url: probSpec.url,
          difficulty: probSpec.difficulty,
          category: probSpec.category,
          primaryPatternId,
          secondaryPatternIds,
          dataStructures: probSpec.dataStructures || [],
          patternIds
        });
        newProblemsAdded++;
      }
    }

    const finalProblemCount = await Problem.countDocuments();
    console.log(`[Sync Script] Sync complete! Final problem count: ${finalProblemCount}`);

    console.log('==================================================');
    console.log('SYNC REPORT SUMMARY:');
    console.log(`1. Problems before update: ${initialProblemCount}`);
    console.log(`2. Problems after update:  ${finalProblemCount}`);
    console.log(`3. New problems added:      ${newProblemsAdded}`);
    console.log(`4. Existing updated:        ${existingProblemsUpdated}`);
    console.log(`5. Duplicates merged:       ${duplicatesPrevented}`);
    console.log(`6. Patterns synced:         ${canonicalPatterns.length}`);
    console.log('==================================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('[Sync Script Error]:', err);
    process.exit(1);
  }
}

syncCanonicalDataset();
