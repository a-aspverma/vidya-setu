const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contentController = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { handleUploadError } = require('../middleware/upload');

// Validation rules
const contentValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('grade').notEmpty().withMessage('Grade is required'),
  body('contentType').isIn(['video', 'audio', 'pdf', 'text', 'image']).withMessage('Invalid content type')
];

// Single .fields() call — both fields processed in one stream pass
const uploadFields = upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

// Public routes
router.get('/', contentController.getAllContent);
router.get('/:id', contentController.getContent);

// Protected routes - Students can access
router.post('/:id/like', protect, contentController.toggleLike);
router.post('/:id/download', protect, contentController.incrementDownload);

// Protected routes - Teachers and Admins only
router.post(
  '/',
  protect,
  authorize('teacher', 'admin'),
  uploadFields,
  handleUploadError,   // catches multer + Cloudinary size errors
  contentValidation,
  validate,
  contentController.createContent
);

router.put(
  '/:id',
  protect,
  authorize('teacher', 'admin'),
  uploadFields,
  handleUploadError,   // catches multer + Cloudinary size errors
  contentController.updateContent
);

router.delete(
  '/:id',
  protect,
  authorize('teacher', 'admin'),
  contentController.deleteContent
);

router.patch(
  '/:id/publish',
  protect,
  authorize('teacher', 'admin'),
  contentController.togglePublish
);

module.exports = router;