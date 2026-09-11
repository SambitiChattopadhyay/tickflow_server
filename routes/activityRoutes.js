
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  startActivity,
  pauseActivity,
  resumeActivity,
  stopActivity,
  getActivities,
  getDailySummary,
  getActiveActivity,
} = require("../controllers/activityController");

router.post("/start", protect, startActivity);

router.get("/active", protect, getActiveActivity);
router.get("/summary/today", protect, getDailySummary);

router.put("/pause/:id", protect, pauseActivity);
router.put("/resume/:id", protect, resumeActivity);
router.put("/stop/:id", protect, stopActivity);

router.get("/", protect, getActivities);

module.exports = router;