const express = require('express');
const router = express.Router();
const extensionController = require('../controllers/extensionController');
const authMiddleware = require('../middleware/authMiddleware');

// Note: extension routes can accept auth header or run in optional auth mode
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authMiddleware(req, res, next);
  }
  next();
};

router.post('/detect', optionalAuth, extensionController.detectProblem);
router.post('/add-or-get', authMiddleware, extensionController.addOrGetFromExtension);

module.exports = router;
