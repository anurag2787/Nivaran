const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// Public endpoint for citizen scheme discovery chat bot
router.post("/scheme-advisor", aiController.adviseSchemes);

module.exports = router;
