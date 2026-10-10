const { sendError } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return sendError(res, message, err.errors || [err.message], statusCode);
};

module.exports = errorHandler;
