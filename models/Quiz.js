const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  questionType: {
    type: String,
    enum: ['mcq', 'true-false', 'short-answer'],
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  },
  points: {
    type: Number,
    default: 1
  },
  order: {
    type: Number,
    default: 0
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    enum: ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer Science', 'General Knowledge', 'Other']
  },
  grade: {
    type: String,
    required: [true, 'Please provide a grade level'],
    enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'All']
  },
  relatedContent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  },
  questions: [questionSchema],
  duration: {
    type: Number, // Duration in minutes
    default: 30
  },
  passingScore: {
    type: Number, // Percentage
    default: 60
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Calculate total points before saving
quizSchema.pre('save', function(next) {
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 1), 0);
  }
  next();
});

// Index for faster queries
quizSchema.index({ subject: 1, grade: 1, isPublished: 1 });
quizSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
