const Content = require('../models/Content');
const Progress = require('../models/Progress');
const { cloudinary } = require('../middleware/upload');

// Helper: extract Cloudinary public_id from a secure URL
const extractPublicId = (url) => {
  if (!url) return null;
  try {
    // URL format: https://res.cloudinary.com/<cloud>/image|video|raw/upload/v123456/<folder>/<public_id>.<ext>
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const afterUpload = parts[1]; // e.g. "v1234567/content/videos/abc123.mp4"
    // Remove version segment if present
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    // Remove extension
    const withoutExt = withoutVersion.replace(/\.[^/.]+$/, '');
    return withoutExt;
  } catch {
    return null;
  }
};

// Helper: determine Cloudinary resource_type from a URL or mime type
const getResourceType = (url = '') => {
  if (url.includes('/video/upload/') || url.includes('/audio/upload/')) return 'video';
  if (url.includes('/image/upload/')) return 'image';
  return 'image';
};

// @desc    Create new content
// @route   POST /api/content
// @access  Private (Teacher, Admin)
exports.createContent = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      grade,
      contentType,
      textContent,
      duration,
      tags,
      difficulty
    } = req.body;

    let fileUrl = '';
    let thumbnail = '';
    let fileSize = 0;

    // Cloudinary returns secure_url directly on the file object
    if (req.files) {
      if (req.files.file && req.files.file[0]) {
        const uploadedFile = req.files.file[0];
        fileUrl = uploadedFile.path || uploadedFile.secure_url || '';
        fileSize = uploadedFile.size || 0;
      }
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        thumbnail = req.files.thumbnail[0].path || req.files.thumbnail[0].secure_url || '';
      }
    }

    const content = await Content.create({
      title,
      description,
      subject,
      grade,
      contentType,
      fileUrl,
      textContent,
      thumbnail,
      duration: duration || 0,
      fileSize,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      difficulty: difficulty || 'beginner',
      createdBy: req.user.id,
      isPublished: false
    });

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: content
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating content',
      error: error.message
    });
  }
};

// @desc    Get all content (with filters)
// @route   GET /api/content
// @access  Public
exports.getAllContent = async (req, res) => {
  try {
    const {
      subject,
      grade,
      contentType,
      difficulty,
      search,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    const query = { isPublished: false };

    if (subject) query.subject = subject;
    if (grade) query.grade = grade;
    if (contentType) query.contentType = contentType;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$text = { $search: search };
    }

    const contents = await Content.find(query)
      .populate('createdBy', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Content.countDocuments(query);

    res.status(200).json({
      success: true,
      data: contents,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content',
      error: error.message
    });
  }
};

// @desc    Get single content
// @route   GET /api/content/:id
// @access  Public
exports.getContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('createdBy', 'name email role');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    content.views += 1;
    await content.save();

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching content',
      error: error.message
    });
  }
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private (Teacher, Admin)
exports.updateContent = async (req, res) => {
  try {
    let content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    if (content.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this content'
      });
    }

    // If a new file is uploaded, delete the old one from Cloudinary
    if (req.files) {
      if (req.files.file && req.files.file[0]) {
        const oldPublicId = extractPublicId(content.fileUrl);
        if (oldPublicId) {
          const resourceType = getResourceType(content.fileUrl);
          await cloudinary.uploader.destroy(oldPublicId, { resource_type: resourceType }).catch(console.error);
        }
        req.body.fileUrl = req.files.file[0].path || req.files.file[0].secure_url;
        req.body.fileSize = req.files.file[0].size || 0;
      }
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const oldThumbId = extractPublicId(content.thumbnail);
        if (oldThumbId) {
          await cloudinary.uploader.destroy(oldThumbId, { resource_type: 'image' }).catch(console.error);
        }
        req.body.thumbnail = req.files.thumbnail[0].path || req.files.thumbnail[0].secure_url;
      }
    }

    content = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating content',
      error: error.message
    });
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private (Teacher, Admin)
exports.deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    if (content.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this content'
      });
    }

    // Delete files from Cloudinary
    if (content.fileUrl) {
      const publicId = extractPublicId(content.fileUrl);
      if (publicId) {
        const resourceType = getResourceType(content.fileUrl);
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType }).catch(console.error);
      }
    }
    if (content.thumbnail) {
      const thumbId = extractPublicId(content.thumbnail);
      if (thumbId) {
        await cloudinary.uploader.destroy(thumbId, { resource_type: 'image' }).catch(console.error);
      }
    }

    await content.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting content',
      error: error.message
    });
  }
};

// @desc    Publish/Unpublish content
// @route   PATCH /api/content/:id/publish
// @access  Private (Teacher, Admin)
exports.togglePublish = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    content.isPublished = !content.isPublished;
    await content.save();

    res.status(200).json({
      success: true,
      message: `Content ${content.isPublished ? 'published' : 'unpublished'} successfully`,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating content',
      error: error.message
    });
  }
};

// @desc    Like/Unlike content
// @route   POST /api/content/:id/like
// @access  Private
exports.toggleLike = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    const userIndex = content.likes.indexOf(req.user.id);

    if (userIndex > -1) {
      content.likes.splice(userIndex, 1);
    } else {
      content.likes.push(req.user.id);
    }

    await content.save();

    res.status(200).json({
      success: true,
      message: userIndex > -1 ? 'Content unliked' : 'Content liked',
      data: { likes: content.likes.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating like',
      error: error.message
    });
  }
};

// @desc    Increment download count
// @route   POST /api/content/:id/download
// @access  Private
exports.incrementDownload = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    content.downloads += 1;
    await content.save();

    res.status(200).json({
      success: true,
      message: 'Download count updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating download count',
      error: error.message
    });
  }
};