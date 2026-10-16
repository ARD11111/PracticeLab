const express = require('express');
const router = express.Router();
const patternController = require('../controllers/patternController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, patternController.getPatterns);
router.get('/:id', authMiddleware, patternController.getPatternById);

module.exports = router;
