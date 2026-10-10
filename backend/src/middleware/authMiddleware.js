const { sendError } = require("../utils/response");

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Authentication required. Missing Bearer token.", [], 401);
  }
  // In Phase 1 basic setup, authenticate mock session
  req.user = {
    id: "user-101",
    email: "citizen@example.com",
    role: "citizen",
  };
  next();
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(res, "Access forbidden: insufficient role permissions", [], 403);
    }
    next();
  };
};

module.exports = {
  requireAuth,
  requireRole,
};
