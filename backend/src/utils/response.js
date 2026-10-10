/**
 * Standard API response envelope helpers
 * Conform to Phase 1 contract:
 * Success: { success: true, message: string, data: any }
 * Error:   { success: false, message: string, errors: any[] }
 */

const sendSuccess = (res, message = "Success", data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, message = "An error occurred", errors = [], statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [errors],
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
