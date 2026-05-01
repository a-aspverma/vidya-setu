const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
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
  contentType: {
    type: String,
    required: [true, 'Please specify content type'],
    enum: ['video', 'audio', 'pdf', 'text', 'image']
  },
  fileUrl: {
    type: String,
    default: ''
  },
  textContent: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // Duration in minutes for video/audio
    default: 0
  },
  fileSize: {
    type: Number, // File size in bytes
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
contentSchema.index({ subject: 1, grade: 1, isPublished: 1 });
contentSchema.index({ createdBy: 1 });
contentSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Content', contentSchema);
