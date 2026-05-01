const User = require('../models/User');
const Content = require('../models/Content');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, grade, school, location, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (grade) user.grade = grade;
    if (school) user.school = school;
    if (location) user.location = location;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// @desc    Get platform statistics (Admin)
// @route   GET /api/users/admin/statistics
// @access  Private (Admin)
exports.getPlatformStatistics = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const activeUsers = await User.countDocuments({ isActive: true });

    // Content statistics
    const totalContent = await Content.countDocuments();
    const publishedContent = await Content.countDocuments({ isPublished: true });
    const contentByType = await Content.aggregate([
      { $group: { _id: '$contentType', count: { $sum: 1 } } }
    ]);

    // Quiz statistics
    const totalQuizzes = await Quiz.countDocuments();
    const publishedQuizzes = await Quiz.countDocuments({ isPublished: true });
    const totalQuizAttempts = await QuizResult.countDocuments();

    // Recent activity
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort('-createdAt')
      .limit(5);

    const recentContent = await Content.find()
      .populate('createdBy', 'name')
      .sort('-createdAt')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          students: totalStudents,
          teachers: totalTeachers,
          active: activeUsers
        },
        content: {
          total: totalContent,
          published: publishedContent,
          byType: contentByType
        },
        quizzes: {
          total: totalQuizzes,
          published: publishedQuizzes,
          attempts: totalQuizAttempts
        },
        recentActivity: {
          users: recentUsers,
          content: recentContent
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};
