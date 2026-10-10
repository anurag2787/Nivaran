const express = require("express");
const router = express.Router();
const { getOverviewStats, getSchemes } = require("../controllers/statsController");

router.get("/overview", getOverviewStats);
router.get("/schemes", getSchemes);

module.exports = router;
