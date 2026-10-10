const express = require("express");
const router = express.Router();
const {
  getOverview,
  getCategories,
  getDepartments,
  getTrends,
} = require("../controllers/analyticsController");

router.get("/overview", getOverview);
router.get("/categories", getCategories);
router.get("/departments", getDepartments);
router.get("/trends", getTrends);

module.exports = router;
