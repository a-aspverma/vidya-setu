const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number, // Time spent in minutes
    default: 0
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  },
  bookmarked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for unique student-content combination
progressSchema.index({ student: 1, content: 1 }, { unique: true });

// Index for faster queries
progressSchema.index({ student: 1, status: 1 });
progressSchema.index({ student: 1, lastAccessedAt: -1 });

module.exports = mongoose.model('Progress', progressSchema);
