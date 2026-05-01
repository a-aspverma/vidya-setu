const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

router.get('/', userController.getAllUsers);
router.get('/admin/statistics', userController.getPlatformStatistics);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
