const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/queue', authMiddleware, reviewController.getReviewQueue);
router.patch('/archive/:problemId', authMiddleware, reviewController.toggleArchive);

module.exports = router;
