const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const issueRoutes = require("./issueRoutes");
const statsRoutes = require("./statsRoutes");

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Nivaran API is operational",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

router.use("/auth", authRoutes);
router.use("/issues", issueRoutes);
router.use("/stats", statsRoutes);

module.exports = router;
