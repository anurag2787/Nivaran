const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/response");

const JWT_SECRET = process.env.JWT_SECRET || "nivaran_jwt_secret_phase1_key_2026";

// Demo in-memory fallback user store
let inMemoryUsers = [
  {
    id: "user-101",
    _id: "user-101",
    name: "Aarav Sharma",
    email: "citizen@example.com",
    role: "citizen",
    phone: "+91 98765 43210",
    avatarUrl: "",
    passwordHash: "",
  },
  {
    id: "user-102",
    _id: "user-102",
    name: "Er. Rajesh Verma",
    email: "officer@example.com",
    role: "officer",
    phone: "+91 98111 22334",
    avatarUrl: "",
    passwordHash: "",
  },
  {
    id: "user-103",
    _id: "user-103",
    name: "Dr. K. S. Rao",
    email: "admin@example.com",
    role: "admin",
    phone: "+91 99000 11223",
    avatarUrl: "",
    passwordHash: "",
  },
];

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id ? user._id.toString() : user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone = "" } = req.body;
    if (!name || !email || !password) {
      return sendError(res, "Name, email, and password are required", [], 400);
    }

    if (password.length < 6) {
      return sendError(res, "Password must be at least 6 characters long", [], 400);
    }

    // Role is strictly citizen for public registration (Workstream A requirement)
    const role = "citizen";
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    try {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return sendError(res, "An account with this email already exists", [], 409);
      }
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        phone,
      });
    } catch {
      // Fallback in-memory
      const existing = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return sendError(res, "An account with this email already exists", [], 409);
      }
      user = {
        id: `user-${Date.now()}`,
        _id: `user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role,
        phone,
        passwordHash: hashedPassword,
      };
      inMemoryUsers.push(user);
    }

    const token = generateToken(user);
    const userPayload = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    return sendSuccess(
      res,
      "Account registered successfully",
      { user: userPayload, token },
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
    let passwordMatches = false;

    try {
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        passwordMatches = await bcrypt.compare(password, user.password);
      }
    } catch {
      // DB offline / fallback
    }

    if (!user) {
      user = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        // If demo pre-populated user without hash, allow demo password
        if (user.passwordHash) {
          passwordMatches = await bcrypt.compare(password, user.passwordHash);
        } else {
          passwordMatches = true; // demo shortcut
        }
      }
    }

    // Demo shortcut for quick testing: allow demo accounts with demo password
    if (!user && (email.includes("citizen") || email.includes("officer") || email.includes("admin"))) {
      const demoRole = email.includes("officer") ? "officer" : email.includes("admin") ? "admin" : "citizen";
      user = {
        id: `demo-${demoRole}`,
        _id: `demo-${demoRole}`,
        name: `${demoRole.toUpperCase()} Demo User`,
        email,
        role: demoRole,
        phone: "+91 98765 00000",
      };
      passwordMatches = true;
    }

    if (!user || !passwordMatches) {
      return sendError(res, "Invalid email or password", [], 401);
    }

    const token = generateToken(user);
    const userPayload = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
    };

    return sendSuccess(res, "Login successful", { user: userPayload, token });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    let user;
    try {
      if (userId) {
        user = await User.findById(userId).select("-password");
      }
    } catch {}

    if (!user) {
      user = inMemoryUsers.find((u) => u.id === userId || u._id === userId) || req.user;
    }

    return sendSuccess(res, "User profile fetched", { user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { name, phone, avatarUrl } = req.body;

    let updated;
    try {
      if (userId) {
        updated = await User.findByIdAndUpdate(
          userId,
          { ...(name && { name }), ...(phone && { phone }), ...(avatarUrl && { avatarUrl }) },
          { new: true }
        ).select("-password");
      }
    } catch {}

    if (!updated) {
      const found = inMemoryUsers.find((u) => u.id === userId || u._id === userId);
      if (found) {
        if (name) found.name = name;
        if (phone) found.phone = phone;
        if (avatarUrl) found.avatarUrl = avatarUrl;
        updated = found;
      }
    }

    return sendSuccess(res, "Profile updated successfully", { user: updated || req.user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
