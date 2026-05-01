const Progress = require('../models/Progress');
const Content = require('../models/Content');
const QuizResult = require('../models/QuizResult');

// @desc    Update or create progress
// @route   POST /api/progress
// @access  Private
exports.updateProgress = async (req, res) => {
  try {
    const { contentId, status, progressPercentage, timeSpent, notes } = req.body;

    // Check if content exists
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Find existing progress or create new
    let progress = await Progress.findOne({
      student: req.user.id,
      content: contentId
    });

    if (progress) {
      // Update existing progress
      if (status) progress.status = status;
      if (progressPercentage !== undefined) progress.progressPercentage = progressPercentage;
      if (timeSpent) progress.timeSpent += timeSpent;
      if (notes) progress.notes = notes;
      
      progress.lastAccessedAt = Date.now();
      
      if (status === 'completed' && !progress.completedAt) {
        progress.completedAt = Date.now();
        progress.progressPercentage = 100;
      }
      
      await progress.save();
    } else {
      // Create new progress
      progress = await Progress.create({
        student: req.user.id,
        content: contentId,
        status: status || 'in-progress',
        progressPercentage: progressPercentage || 0,
        timeSpent: timeSpent || 0,
        notes: notes || '',
        lastAccessedAt: Date.now(),
        completedAt: status === 'completed' ? Date.now() : null
      });
    }

    const populatedProgress = await Progress.findById(progress._id)
      .populate('content', 'title subject grade contentType');

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: populatedProgress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating progress',
      error: error.message
    });
  }
};

// @desc    Get student's progress for all content
// @route   GET /api/progress
// @access  Private
exports.getMyProgress = async (req, res) => {
  try {
    const { status, subject, grade } = req.query;

    // Build query
    const query = { student: req.user.id };
    if (status) query.status = status;

    const progress = await Progress.find(query)
      .populate({
        path: 'content',
        select: 'title subject grade contentType thumbnail duration',
        match: {
          ...(subject && { subject }),
          ...(grade && { grade })
        }
      })
      .sort('-lastAccessedAt');

    // Filter out null content (in case of match filters)
    const filteredProgress = progress.filter(p => p.content !== null);

    res.status(200).json({
      success: true,
      data: filteredProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching progress',
      error: error.message
    });
  }
};

// @desc    Get progress for specific content
// @route   GET /api/progress/:contentId
// @access  Private
// @desc    Get progress for specific content
// @route   GET /api/progress/:contentId
// @access  Private
exports.getContentProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      student: req.user.id,
      content: req.params.contentId
    }).populate('content', 'title subject grade contentType');

    // ✅ Changed: return 200 with null instead of 404
    if (!progress) {
      return res.status(200).json({
        success: true,
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching progress',
      error: error.message
    });
  }
};

// @desc    Toggle bookmark for content
// @route   PATCH /api/progress/:contentId/bookmark
// @access  Private
exports.toggleBookmark = async (req, res) => {
  try {
    let progress = await Progress.findOne({
      student: req.user.id,
      content: req.params.contentId
    });

    if (!progress) {
      // Create progress if it doesn't exist
      progress = await Progress.create({
        student: req.user.id,
        content: req.params.contentId,
        bookmarked: true
      });
    } else {
      progress.bookmarked = !progress.bookmarked;
      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: progress.bookmarked ? 'Content bookmarked' : 'Bookmark removed',
      data: { bookmarked: progress.bookmarked }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating bookmark',
      error: error.message
    });
  }
};

// @desc    Get student dashboard statistics
// @route   GET /api/progress/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get progress statistics
    const totalProgress = await Progress.countDocuments({ student: studentId });
    const completedLessons = await Progress.countDocuments({ 
      student: studentId, 
      status: 'completed' 
    });
    const inProgressLessons = await Progress.countDocuments({ 
      student: studentId, 
      status: 'in-progress' 
    });

    // Get quiz statistics
    const totalQuizzes = await QuizResult.countDocuments({ student: studentId });
    const passedQuizzes = await QuizResult.countDocuments({ 
      student: studentId, 
      passed: true 
    });

    // Get average quiz score
    const quizResults = await QuizResult.find({ student: studentId });
    const averageScore = quizResults.length > 0
      ? quizResults.reduce((sum, r) => sum + r.percentage, 0) / quizResults.length
      : 0;

    // Get total time spent
    const progressRecords = await Progress.find({ student: studentId });
    const totalTimeSpent = progressRecords.reduce((sum, p) => sum + p.timeSpent, 0);

    // Get recent activity
    const recentProgress = await Progress.find({ student: studentId })
      .populate('content', 'title subject grade contentType')
      .sort('-lastAccessedAt')
      .limit(5);

    const recentQuizzes = await QuizResult.find({ student: studentId })
      .populate('quiz', 'title subject grade')
      .sort('-submittedAt')
      .limit(5);

    // Get subject-wise progress
    const subjectProgress = await Progress.aggregate([
      { $match: { student: req.user._id } },
      {
        $lookup: {
          from: 'contents',
          localField: 'content',
          foreignField: '_id',
          as: 'contentInfo'
        }
      },
      { $unwind: '$contentInfo' },
      {
        $group: {
          _id: '$contentInfo.subject',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          avgProgress: { $avg: '$progressPercentage' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalLessons: totalProgress,
          completedLessons,
          inProgressLessons,
          totalQuizzes,
          passedQuizzes,
          averageScore: parseFloat(averageScore.toFixed(2)),
          totalTimeSpent: Math.round(totalTimeSpent)
        },
        recentActivity: {
          recentProgress,
          recentQuizzes
        },
        subjectProgress
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get performance analytics
// @route   GET /api/progress/analytics
// @access  Private
exports.getAnalytics = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { period = '30' } = req.query; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Quiz performance over time
    const quizPerformance = await QuizResult.find({
      student: studentId,
      submittedAt: { $gte: startDate }
    })
      .select('percentage submittedAt quiz')
      .populate('quiz', 'title subject')
      .sort('submittedAt');

    // Learning time over time
    const learningTime = await Progress.aggregate([
      {
        $match: {
          student: req.user._id,
          lastAccessedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$lastAccessedAt' }
          },
          totalTime: { $sum: '$timeSpent' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Subject-wise performance
    const subjectPerformance = await QuizResult.aggregate([
      { $match: { student: req.user._id } },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quiz',
          foreignField: '_id',
          as: 'quizInfo'
        }
      },
      { $unwind: '$quizInfo' },
      {
        $group: {
          _id: '$quizInfo.subject',
          averageScore: { $avg: '$percentage' },
          totalAttempts: { $sum: 1 },
          passed: {
            $sum: { $cond: ['$passed', 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        quizPerformance,
        learningTime,
        subjectPerformance
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};
