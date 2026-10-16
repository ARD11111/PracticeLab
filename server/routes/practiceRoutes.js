const express = require('express');
const router = express.Router();
const practiceController = require('../controllers/practiceController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/session', authMiddleware, practiceController.createSession);
router.get('/history', authMiddleware, practiceController.getHistory);

module.exports = router;
