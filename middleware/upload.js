const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Single CloudinaryStorage that handles all fields dynamically
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Thumbnail field always goes to images
    if (file.fieldname === 'thumbnail') {
      return {
        folder: 'content/thumbnails',
        resource_type: 'image',
        transformation: [{ width: 800, height: 450, crop: 'fill', quality: 'auto' }]
      };
    }

    // Main content file — route by mime type
    if (file.mimetype.startsWith('video/')) {
      return {
        folder: 'content/videos',
        resource_type: 'video',
        chunk_size: 6000000  // 6MB chunks — required for files > 100MB on paid plans
      };
    }

    if (file.mimetype.startsWith('audio/')) {
      return {
        folder: 'content/audio',
        resource_type: 'video', // Cloudinary uses 'video' resource_type for audio
        chunk_size: 6000000
      };
    }

    if (file.mimetype === 'application/pdf') {
  return {
    folder: 'content/documents',
    resource_type: 'raw' // ✅ CORRECT
  };
}

    if (file.mimetype.startsWith('image/')) {
      return {
        folder: 'content/images',
        resource_type: 'image'
      };
    }

    return {
      folder: 'content/misc',
      resource_type: 'auto'
    };
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`), false);
  }
};

// Multer limits — set to 100MB so multer itself never rejects before Cloudinary
// The actual enforced limit comes from your Cloudinary plan + the check below
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024;

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

// ─── Multer error handler middleware ─────────────────────────────────────────
// Use this AFTER upload.fields() in your route to return clean JSON errors
const handleUploadError = (err, req, res, next) => {
  if (err) {
    // Multer file size error
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum allowed size is ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB.`
      });
    }

    // Cloudinary rejection (comes as a rejection on the storage stream)
    if (err.message && err.message.toLowerCase().includes('file size too large')) {
      return res.status(400).json({
        success: false,
        message: 'File too large for your Cloudinary plan. Maximum is 10MB on the free plan. Upgrade your plan or compress the file.'
      });
    }

    // Generic upload error
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed'
    });
  }
  next();
};

module.exports = upload;
module.exports.handleUploadError = handleUploadError;
module.exports.cloudinary = cloudinary;