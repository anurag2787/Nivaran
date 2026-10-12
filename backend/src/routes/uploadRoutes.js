const express = require("express");
const router = express.Router();
const { uploadSingleImage } = require("../middleware/uploadMiddleware");
const { uploadStream, isConfigured } = require("../config/cloudinary");
const { sendSuccess, sendError } = require("../utils/response");

/**
 * POST /api/v1/upload
 * Upload an image to Cloudinary
 */
router.post("/", uploadSingleImage, async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, "No image file provided. Please choose a valid image file.", [
        "Missing file in request",
      ], 400);
    }

    if (!isConfigured()) {
      return sendError(
        res,
        "Cloudinary is not configured on the server. Please check environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).",
        ["Cloudinary credentials missing"],
        503
      );
    }

    const folder = req.body.folder || "nivaran/issues";

    const result = await uploadStream(req.file.buffer, {
      folder,
      resource_type: "image",
    });

    const responseData = {
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    };

    return sendSuccess(res, "Image uploaded successfully to Cloudinary", responseData, 200);
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message || error);

    // Provide friendly instruction for restricted API keys
    const isPermissionError =
      error.http_code === 403 ||
      (error.message && error.message.includes("missing permissions"));

    if (isPermissionError) {
      return sendError(
        res,
        "Cloudinary upload rejected: The configured Cloudinary API Key does not have 'create' permissions. Please use the Master API Key from Cloudinary Console Settings.",
        [error.message || "Permission denied"],
        403
      );
    }

    return sendError(
      res,
      error.message || "Failed to upload image to Cloudinary",
      [error.message || "Upload failed"],
      500
    );
  }
});

module.exports = router;

