const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  getOfficers,
  assignOfficerDepartment,
  getAllUsers,
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.patch("/profile", requireAuth, updateProfile);
router.get("/officers", getOfficers);
router.get("/users", getAllUsers);
router.post("/assign-officer", assignOfficerDepartment);

module.exports = router;
