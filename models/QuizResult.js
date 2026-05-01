const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  pointsEarned: {
    type: Number,
    default: 0
  }
});

const quizResultSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [answerSchema],
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalPoints: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  passed: {
    type: Boolean,
    default: false
  },
  timeTaken: {
    type: Number, // Time taken in minutes
    default: 0
  },
  startedAt: {
    type: Date,
    required: true
  },
  submittedAt: {
    type: Date,
    required: true
  },
  attemptNumber: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Index for faster queries
quizResultSchema.index({ student: 1, quiz: 1 });
quizResultSchema.index({ student: 1, submittedAt: -1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);
