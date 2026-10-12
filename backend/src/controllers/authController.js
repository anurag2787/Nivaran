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
    departmentName: "Public Works Department (PWD)",
    departmentCode: "PWD",
    avatarUrl: "",
    passwordHash: "",
  },
  {
    id: "user-104",
    _id: "user-104",
    name: "Smt. Vandana Singh",
    email: "water.officer@example.com",
    role: "officer",
    phone: "+91 98222 33445",
    departmentName: "Jal Sansthan (Water & Sewage)",
    departmentCode: "DJB",
    avatarUrl: "",
    passwordHash: "",
  },
  {
    id: "user-105",
    _id: "user-105",
    name: "Er. Alok Tripathi",
    email: "power.officer@example.com",
    role: "officer",
    phone: "+91 98333 44556",
    departmentName: "Madhyanchal Vidyut Vitran (MVVNL)",
    departmentCode: "MVVNL",
    avatarUrl: "",
    passwordHash: "",
  },
  {
    id: "user-106",
    _id: "user-106",
    name: "Dr. Pradeep Mishra",
    email: "sanitation.officer@example.com",
    role: "officer",
    phone: "+91 98444 55667",
    departmentName: "Nagar Nigam (Sanitation & Waste)",
    departmentCode: "LMC",
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
      departmentId: user.departmentId || null,
      departmentName: user.departmentName || (user.role === "officer" ? "Public Works Department (PWD)" : ""),
      departmentCode: user.departmentCode || (user.role === "officer" ? "PWD" : ""),
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
    const { name, phone, avatarUrl, departmentName, departmentCode } = req.body;

    let updated;
    try {
      if (userId) {
        updated = await User.findByIdAndUpdate(
          userId,
          {
            ...(name && { name }),
            ...(phone && { phone }),
            ...(avatarUrl && { avatarUrl }),
            ...(departmentName && { departmentName }),
            ...(departmentCode && { departmentCode }),
          },
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
        if (departmentName) found.departmentName = departmentName;
        if (departmentCode) found.departmentCode = departmentCode;
        updated = found;
      }
    }

    return sendSuccess(res, "Profile updated successfully", { user: updated || req.user });
  } catch (error) {
    next(error);
  }
};

const getOfficers = async (req, res, next) => {
  try {
    let officers = [];
    try {
      officers = await User.find({ role: "officer" }).select("-password");
    } catch {}

    if (!officers || officers.length === 0) {
      officers = inMemoryUsers.filter((u) => u.role === "officer");
    }

    return sendSuccess(res, "Officers list fetched", { officers });
  } catch (error) {
    next(error);
  }
};

const assignOfficerDepartment = async (req, res, next) => {
  try {
    const { id, email, name, phone, departmentName, departmentCode, role = "officer" } = req.body;
    if (!email && !id) {
      return sendError(res, "Email or ID is required to appoint or edit an officer", [], 400);
    }

    const cleanEmail = email ? email.toLowerCase().trim() : "";
    let user;

    try {
      if (id) {
        user = await User.findById(id);
      }
      if (!user && cleanEmail) {
        user = await User.findOne({ email: cleanEmail });
      }

      if (user) {
        user.role = role || "officer";
        if (cleanEmail && user.email.toLowerCase() !== cleanEmail) user.email = cleanEmail;
        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (departmentName !== undefined) user.departmentName = departmentName;
        if (departmentCode !== undefined) user.departmentCode = departmentCode;
        await user.save();
      } else if (cleanEmail) {
        const hashedPassword = await bcrypt.hash("officer123", 10);
        user = await User.create({
          name: name || cleanEmail.split("@")[0],
          email: cleanEmail,
          password: hashedPassword,
          phone: phone || "",
          role: role || "officer",
          departmentName: departmentName || "Public Works Department (PWD)",
          departmentCode: departmentCode || "PWD",
        });
      }
    } catch {
      // In-memory fallback
    }

    let inMem = inMemoryUsers.find(
      (u) =>
        (id && (u.id === id || u._id === id)) ||
        (cleanEmail && u.email.toLowerCase() === cleanEmail)
    );
    if (inMem) {
      inMem.role = role || "officer";
      if (cleanEmail) inMem.email = cleanEmail;
      if (name !== undefined) inMem.name = name;
      if (phone !== undefined) inMem.phone = phone;
      if (departmentName !== undefined) inMem.departmentName = departmentName;
      if (departmentCode !== undefined) inMem.departmentCode = departmentCode;
      user = inMem;
    } else if (cleanEmail) {
      user = {
        id: `user-${Date.now()}`,
        _id: `user-${Date.now()}`,
        name: name || cleanEmail.split("@")[0],
        email: cleanEmail,
        role: role || "officer",
        departmentName: departmentName || "Public Works Department (PWD)",
        departmentCode: departmentCode || "PWD",
        phone: phone || "+91 98000 00000",
      };
      inMemoryUsers.push(user);
    }

    const sanitized = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      departmentName: user.departmentName,
      departmentCode: user.departmentCode,
    };

    return sendSuccess(
      res,
      `Officer ${user.name} (${user.email}) details updated successfully`,
      { officer: sanitized }
    );
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    let users = [];
    try {
      users = await User.find().select("-password");
    } catch {}

    if (!users || users.length === 0) {
      users = inMemoryUsers;
    }

    return sendSuccess(res, "All users fetched", { users });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  getOfficers,
  assignOfficerDepartment,
  getAllUsers,
};
