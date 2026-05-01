const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private (Teacher, Admin)
exports.createQuiz = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const {
      title,
      description,
      subject,
      grade,
      questions,
      duration,
      passingScore,
      difficulty,
      relatedContent,
      tags
    } = req.body;

    const quiz = await Quiz.create({
      title,
      description,
      subject,
      grade,
      questions: questions.map(q => ({
        ...q,
        options: q.questionType === 'short-answer' ? [] : q.options
      })),
      duration: duration || 30,
      passingScore: passingScore || 60,
      difficulty: difficulty || 'beginner',
      relatedContent,
      tags: tags || [],
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });

  } catch (error) {
    console.error('🔥 Create quiz error:', error); // keep this
    res.status(500).json({
      success: false,
      message: 'Error creating quiz',
      error: error.message
    });
  }
};

// @desc    Get all quizzes (with filters)
// @route   GET /api/quizzes
// @access  Public
exports.getAllQuizzes = async (req, res) => {
  try {
    const {
      subject,
      grade,
      difficulty,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = { isPublished: false };

    if (subject) query.subject = subject;
    if (grade) query.grade = grade;
    if (difficulty) query.difficulty = difficulty;

    // Execute query with pagination
    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'name email')
      .populate('relatedContent', 'title subject')
      .select('-questions.correctAnswer -questions.options.isCorrect') // Hide answers
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const count = await Quiz.countDocuments(query);

    res.status(200).json({
      success: true,
      data: quizzes,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quizzes',
      error: error.message
    });
  }
};

// @desc    Get single quiz (for attempt)
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('relatedContent', 'title subject')
      .select('-questions.correctAnswer -questions.options.isCorrect'); // Hide answers

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz',
      error: error.message
    });
  }
};

// @desc    Get quiz with answers (for teachers/admins)
// @route   GET /api/quizzes/:id/full
// @access  Private (Teacher, Admin)
exports.getQuizFull = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('relatedContent', 'title subject');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz',
      error: error.message
    });
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:id/submit
// @access  Private
exports.submitQuiz = async (req, res) => {
  try {
    const { answers, startedAt } = req.body;

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Calculate score
    let score = 0;
    const gradedAnswers = [];

    answers.forEach(answer => {
      const question = quiz.questions.id(answer.questionId);
      
      if (question) {
        const isCorrect = question.correctAnswer.toLowerCase().trim() === 
                         answer.userAnswer.toLowerCase().trim();
        
        const pointsEarned = isCorrect ? question.points : 0;
        score += pointsEarned;

        gradedAnswers.push({
          questionId: answer.questionId,
          userAnswer: answer.userAnswer,
          isCorrect,
          pointsEarned
        });
      }
    });

    const percentage = (score / quiz.totalPoints) * 100;
    const passed = percentage >= quiz.passingScore;

    // Calculate time taken
    const submittedAt = new Date();
    const timeTaken = Math.round((submittedAt - new Date(startedAt)) / 60000); // minutes

    // Get attempt number
    const previousAttempts = await QuizResult.countDocuments({
      quiz: quiz._id,
      student: req.user.id
    });

    // Save result
    const result = await QuizResult.create({
      quiz: quiz._id,
      student: req.user.id,
      answers: gradedAnswers,
      score,
      totalPoints: quiz.totalPoints,
      percentage: parseFloat(percentage.toFixed(2)),
      passed,
      timeTaken,
      startedAt,
      submittedAt,
      attemptNumber: previousAttempts + 1
    });

    // Increment quiz attempts
    quiz.attempts += 1;
    await quiz.save();

    // Populate result for response
    const populatedResult = await QuizResult.findById(result._id)
      .populate('quiz', 'title subject grade passingScore');

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: populatedResult
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting quiz',
      error: error.message
    });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Teacher, Admin)
exports.updateQuiz = async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check ownership or admin role
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this quiz'
      });
    }

    quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating quiz',
      error: error.message
    });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Teacher, Admin)
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check ownership or admin role
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this quiz'
      });
    }

    await quiz.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting quiz',
      error: error.message
    });
  }
};

// @desc    Publish/Unpublish quiz
// @route   PATCH /api/quizzes/:id/publish
// @access  Private (Teacher, Admin)
exports.togglePublish = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    quiz.isPublished = !quiz.isPublished;
    await quiz.save();

    res.status(200).json({
      success: true,
      message: `Quiz ${quiz.isPublished ? 'published' : 'unpublished'} successfully`,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating quiz',
      error: error.message
    });
  }
};

// @desc    Get quiz results for a student
// @route   GET /api/quizzes/:id/results
// @access  Private
exports.getQuizResults = async (req, res) => {
  try {
    const results = await QuizResult.find({
      quiz: req.params.id,
      student: req.user.id
    })
      .populate('quiz', 'title subject grade')
      .sort('-submittedAt');

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching results',
      error: error.message
    });
  }
};
