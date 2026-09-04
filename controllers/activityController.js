const Activity = require("../models/Activity");

// START ACTIVITY
const startActivity = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Activity name is required",
      });
    }

    const activity = await Activity.create({
      user: req.user.id,
      name,
      startTime: new Date(),
      status: "active",
    });

    res.status(201).json({
      message: "Activity started",
      activity,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  startActivity,
};