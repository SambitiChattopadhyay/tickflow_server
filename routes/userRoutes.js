const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const User = require("../models/User");


router.get("/profile", authMiddleware, async (req, res) => {
console.log("NEW PROFILE ROUTE IS RUNNING");
  try {

    const user = await User.findById(
      req.user.id
    ).select("-password");


    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }


    res.status(200).json({

      message: "Profile accessed successfully",

      user: user,

    });

  }

  catch (error) {

    console.error("Profile error:", error);

    res.status(500).json({
      message: "Failed to fetch profile",
    });

  }

});


module.exports = router;