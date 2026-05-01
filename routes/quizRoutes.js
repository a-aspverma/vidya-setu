const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const quizController = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Validation rules
const quizValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('grade').notEmpty().withMessage('Grade is required'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required')
];

// Public routes
router.get('/', quizController.getAllQuizzes);

// Protected routes - All authenticated users
router.get('/:id', protect, quizController.getQuiz);
router.post('/:id/submit', protect, quizController.submitQuiz);
router.get('/:id/results', protect, quizController.getQuizResults);

// Protected routes - Teachers and Admins only
router.get('/:id/full', protect, authorize('teacher', 'admin'), quizController.getQuizFull);

router.post(
  '/',
  protect,
  authorize('teacher', 'admin'),
  quizValidation,
  validate,
  quizController.createQuiz
);

router.put(
  '/:id',
  protect,
  authorize('teacher', 'admin'),
  quizController.updateQuiz
);

router.delete(
  '/:id',
  protect,
  authorize('teacher', 'admin'),
  quizController.deleteQuiz
);

router.patch(
  '/:id/publish',
  protect,
  authorize('teacher', 'admin'),
  quizController.togglePublish
);

module.exports = router;
