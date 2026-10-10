const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/response");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "Authentication required. Missing Bearer token.", [], 401);
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "nivaran_jwt_secret_phase1_key_2026";

    try {
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      return next();
    } catch {
      // In case of prototype testing with demo token
      if (token === "mock-jwt-token-nivaran-phase1" || token.startsWith("mock-")) {
        req.user = {
          id: "user-101",
          email: "aarav@example.com",
          role: "citizen",
          name: "Aarav Sharma",
        };
        return next();
      }
      return sendError(res, "Invalid or expired authentication token", [], 401);
    }
  } catch (error) {
    return sendError(res, "Authentication error", [error.message], 401);
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Forbidden: Role '${req.user?.role || "anonymous"}' does not have access to this resource`,
        [],
        403
      );
    }
    next();
  };
};

module.exports = {
  requireAuth,
  requireRole,
};
