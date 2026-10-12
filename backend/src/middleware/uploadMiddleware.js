const multer = require("multer");
const path = require("path");

// Memory storage keeps file buffers in RAM, avoiding temporary files on disk
const storage = multer.memoryStorage();

// Allowed image formats
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// 5 MB maximum file size
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();

  const isMimeValid = ALLOWED_MIME_TYPES.includes(mimeType);
  const isExtValid = ALLOWED_EXTENSIONS.includes(ext);

  if (isMimeValid && isExtValid) {
    return cb(null, true);
  }

  const error = new Error(
    "Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed."
  );
  error.statusCode = 400;
  cb(error, false);
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter,
});

/**
 * Middleware that accepts either 'image' or 'file' field name
 */
const uploadSingleImage = (req, res, next) => {
  const multerMiddleware = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]);

  multerMiddleware(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File too large. Maximum allowed size is 5MB.",
            errors: ["File size exceeded 5MB limit"],
          });
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`,
          errors: [err.message],
        });
      }

      const statusCode = err.statusCode || 400;
      return res.status(statusCode).json({
        success: false,
        message: err.message || "File validation failed",
        errors: [err.message],
      });
    }

    // Normalize single file to req.file
    if (req.files) {
      if (req.files.image && req.files.image.length > 0) {
        req.file = req.files.image[0];
      } else if (req.files.file && req.files.file.length > 0) {
        req.file = req.files.file[0];
      }
    }

    next();
  });
};

module.exports = {
  upload,
  uploadSingleImage,
  MAX_FILE_SIZE,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
};

