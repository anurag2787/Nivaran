const express = require("express");
const router = express.Router();
const {
  getAllIssues,
  getIssueById,
  createIssue,
  updateStatus,
  supportIssue,
} = require("../controllers/issueController");

router.get("/", getAllIssues);
router.get("/:id", getIssueById);
router.post("/", createIssue);
router.patch("/:id/status", updateStatus);
router.post("/:id/support", supportIssue);

module.exports = router;
