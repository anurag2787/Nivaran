const express = require("express");
const router = express.Router();
const {
  getAllIssues,
  getMyIssues,
  getIssueById,
  createIssue,
  updateStatus,
  assignDepartment,
  attachEvidence,
  supportIssue,
} = require("../controllers/issueController");
const { requireAuth, optionalAuth } = require("../middleware/authMiddleware");

// Public issue explorer & details
router.get("/", getAllIssues);
router.get("/mine", optionalAuth, getMyIssues);
router.get("/:id", getIssueById);

// Reporting & interactions
router.post("/", optionalAuth, createIssue);
router.patch("/:id/status", updateStatus);
router.put("/:id/status", updateStatus);
router.patch("/:id/assign", assignDepartment);
router.put("/:id/assign", assignDepartment);
router.post("/:id/evidence", attachEvidence);
router.post("/:id/support", supportIssue);

module.exports = router;
