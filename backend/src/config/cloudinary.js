const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

// Configure Cloudinary using environment variables
function configureCloudinary() {
  try {
    require("dotenv").config({ override: true });
  } catch {}

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }
}

// Initial config
configureCloudinary();

const isConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Uploads a file buffer to Cloudinary via stream.
 * Zero disk footprint: stores nothing on the local file system.
 */
const uploadStream = (buffer, options = {}) => {
  // Ensure config is fresh in case env loaded dynamically
  configureCloudinary();

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: "nivaran/issues",
      resource_type: "image",
      ...options,
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });

    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

module.exports = {
  cloudinary,
  uploadStream,
  isConfigured,
};

