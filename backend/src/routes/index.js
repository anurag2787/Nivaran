const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const issueRoutes = require("./issueRoutes");
const statsRoutes = require("./statsRoutes");
const analyticsRoutes = require("./analyticsRoutes");

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Nivaran API is operational",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
  });
});

router.use("/auth", authRoutes);
router.use("/issues", issueRoutes);
router.use("/stats", statsRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/ai", require("./aiRoutes"));

module.exports = router;
