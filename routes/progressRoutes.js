const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const progressController = require('../controllers/progressController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Validation rules
const progressValidation = [
  body('contentId').notEmpty().withMessage('Content ID is required'),
  body('progressPercentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100')
];

// All routes are protected
router.use(protect);

// Progress routes
router.post('/', progressValidation, validate, progressController.updateProgress);
router.get('/', progressController.getMyProgress);
router.get('/dashboard/stats', progressController.getDashboardStats);
router.get('/analytics', progressController.getAnalytics);
router.get('/:contentId', progressController.getContentProgress);
router.patch('/:contentId/bookmark', progressController.toggleBookmark);

module.exports = router;
