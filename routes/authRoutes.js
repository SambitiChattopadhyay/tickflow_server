const express = require("express");//You're importing Express because you need its routing functionality.Here, instead of creating the entire Express application, we're going to create a router.
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");//I have two API endpoints here. When they're called, I want authController.js to handle them."

const router = express.Router();//This creates a mini-router specifically for these authentication-related URLs.

router.post("/register", registerUser);//If a POST request comes to /register(URL), call registerUser(function).
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;//This makes your router available to other files
//this line from server.js: const authRoutes = require("./routes/authRoutes");That require() gets the router you're exporting here.directly connected: