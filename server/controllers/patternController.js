const Pattern = require('../models/Pattern');
const Problem = require('../models/Problem');

exports.getPatterns = async (req, res) => {
  try {
    const patterns = await Pattern.find().sort({ name: 1 });
    
    // Count problems per pattern
    const patternCounts = await Problem.aggregate([
      { $unwind: '$patternIds' },
      { $group: { _id: '$patternIds', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    patternCounts.forEach(c => {
      countMap[c._id.toString()] = c.count;
    });

    const result = patterns.map(p => ({
      ...p.toObject(),
      problemCount: countMap[p._id.toString()] || 0
    }));

    res.json(result);
  } catch (error) {
    console.error('getPatterns Error:', error);
    res.status(500).json({ message: 'Error fetching patterns.' });
  }
};

exports.getPatternById = async (req, res) => {
  try {
    const { id } = req.params;
    const pattern = await Pattern.findById(id);
    if (!pattern) {
      return res.status(404).json({ message: 'Pattern not found.' });
    }

    const problems = await Problem.find({ patternIds: id });
    res.json({ pattern, problems });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pattern details.' });
  }
};
