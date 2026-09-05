const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  startActivity,
  stopActivity,
} = require("../controllers/activityController");

// Start an activity
router.post("/start", protect, startActivity);
// Stop an activity
router.put("/stop/:id", protect, stopActivity);

module.exports = router;