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

// STOP ACTIVITY
const stopActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: "active",
    });

    if (!activity) {
      return res.status(404).json({
        message: "Active activity not found",
      });
    }

    const endTime = new Date();

    activity.endTime = endTime;
    activity.duration = endTime - activity.startTime;
    activity.status = "completed";

    await activity.save();

    res.status(200).json({
      message: "Activity completed successfully",
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
  stopActivity,
};