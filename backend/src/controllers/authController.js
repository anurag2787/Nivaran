const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/response");

// Mock user store fallback if DB is not populated yet
const MOCK_USER = {
  id: "user-101",
  name: "Aarav Sharma",
  email: "aarav@example.com",
  role: "citizen",
  phone: "+91 9876543210",
  createdAt: new Date().toISOString(),
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role = "citizen", phone = "" } = req.body;
    if (!name || !email || !password) {
      return sendError(res, "Name, email, and password are required", [], 400);
    }

    // Attempt DB creation if connected
    let user;
    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return sendError(res, "User with this email already exists", [], 409);
      }
      user = await User.create({ name, email, password, role, phone });
    } catch {
      // Fallback in case DB is unreachable
      user = { id: `user-${Date.now()}`, name, email, role, phone };
    }

    return sendSuccess(
      res,
      "User registered successfully",
      {
        user: { id: user._id || user.id, name: user.name, email: user.email, role: user.role },
        token: "mock-jwt-token-nivaran-phase1",
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, "Email and password are required", [], 400);
    }

    let user;
    try {
      user = await User.findOne({ email });
    } catch {
      // Fallback
    }

    if (!user) {
      // Allow demo login for Phase 1 basic testing
      user = { ...MOCK_USER, email };
    }

    return sendSuccess(res, "Login successful", {
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: "mock-jwt-token-nivaran-phase1",
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, "Profile fetched successfully", { user: MOCK_USER });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
