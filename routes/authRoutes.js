const express = require("express");

console.log("AUTH ROUTES FILE LOADED");

const {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// CREATE ROUTER
const router = express.Router();


// TEST ROUTE
router.get("/test", (req, res) => {
  res.json({
    message: "Auth router is working",
  });
});


// AUTH ROUTES
router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);


// PROFILE ROUTES
router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);


module.exports = router;