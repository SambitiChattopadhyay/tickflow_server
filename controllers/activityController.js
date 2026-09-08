const Activity = require("../models/Activity");

//START ACTIVITY
const startActivity = async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({
        message: "Task ID is required",
      });
    }

    // Check whether user already has an active activity
    const activeActivity = await Activity.findOne({
      user: req.user.id,
      status: "active",
    });

    if (activeActivity) {
      return res.status(400).json({
        message: "You already have an active activity",
      });
    }

    const Task = require("../models/Task");

    // Find the task belonging to this user
    const task = await Task.findOne({
      _id: taskId,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Create activity linked to task
    const activity = await Activity.create({
      user: req.user.id,
      task: task._id,
      name: task.title,
      startTime: new Date(),
      status: "active",
    });

    res.status(201).json({
      message: "Activity started",
      activity,
    });

  } //end try block
  catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }//end of catch block
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

// GET USER ACTIVITIES
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      user: req.user.id, //This means User A cannot see User B's activities.
    })
    .populate("task", "title")
    .sort({
      createdAt: -1,
    });

    res.status(200).json({
      activities,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET DAILY SUMMARY
const getDailySummary = async (req, res) => {
  try {
    // Start of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Start of tomorrow
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Find today's completed activities
    const activities = await Activity.find({
      user: req.user.id,
      status: "completed",
      startTime: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }).sort({
      startTime: -1,
    });

    // Calculate total duration
    const totalDuration = activities.reduce(
      (total, activity) => total + activity.duration,
      0
    );

    res.status(200).json({
      date: startOfDay,
      activities,
      totalDuration,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET CURRENT ACTIVE ACTIVITY
const getActiveActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({
      user: req.user.id,
      status: "active",
    });

    if (!activity) {
      return res.status(404).json({
        message: "No active activity",
      });
    }

    res.status(200).json({
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
  getActivities,
  getDailySummary,
  getActiveActivity,
};