const User = require('../models/User');

exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('name email settings streakCount createdAt');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user settings.' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, settings } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (name) user.name = name;
    if (settings) {
      user.settings = {
        ...user.settings,
        ...settings
      };
    }

    await user.save();
    res.json({
      message: 'Settings updated successfully.',
      user: {
        name: user.name,
        email: user.email,
        settings: user.settings
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user settings.' });
  }
};
