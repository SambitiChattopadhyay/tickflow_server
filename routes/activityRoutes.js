const express = require("express");
const router = express.Router();
//middleware import
const protect = require("../middleware/authMiddleware");
//controller imports
const {
  startActivity,
  stopActivity,
  getActivities,
  getDailySummary,
  getActiveActivity,
} = require("../controllers/activityController");

//Because it uses: protect you must be logged in.

// Specific/static routes:(fixed URL)
// Start an activity.
router.post("/start", protect, startActivity);
// Get current active activity
router.get("/active", protect, getActiveActivity);
// Get today's activity summary
router.get("/summary/today", protect, getDailySummary);//can technically be in either order..best practice—more specific routes are usually placed before broader/dynamic routes.

//Dynamic routes:(URL has a variable/placeholder whose value changes)
// Stop an activity
router.put("/stop/:id", protect, stopActivity);

// Base route:
// Get all activities for logged-in user
router.get("/", protect, getActivities);


module.exports = router;