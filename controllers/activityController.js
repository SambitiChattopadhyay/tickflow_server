const Activity = require("../models/Activity");
const Task = require("../models/Task");

const startActivity = async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId)
      return res.status(400).json({ message: "Task ID is required" });

    const current = await Activity.findOne({
      user: req.user.id,
      status: { $in: ["active", "paused"] },
    });

    if (current)
      return res.status(400).json({
        message: "You already have a current activity",
      });

    const task = await Task.findOne({
      _id: taskId,
      user: req.user.id,
    });

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    const activity = await Activity.create({
      user: req.user.id,
      task: task._id,
      name: task.title,
      startTime: new Date(),
      duration: 0,
      status: "active",
    });

    res.status(201).json({ message: "Activity started", activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const pauseActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: "active",
    });

    if (!activity)
      return res.status(404).json({
        message: "Active activity not found",
      });

    const now = new Date();

    activity.duration += now - activity.startTime;
    activity.pausedAt = now;
    activity.status = "paused";

    await activity.save();

    res.json({ message: "Activity paused", activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const resumeActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: "paused",
    });

    if (!activity)
      return res.status(404).json({
        message: "Paused activity not found",
      });

    activity.startTime = new Date();
    activity.pausedAt = null;
    activity.status = "active";

    await activity.save();

    res.json({ message: "Activity resumed", activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const stopActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: {
        $in: ["active", "paused"],
      },
    });

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    const endTime = new Date();

    if (activity.status === "active") {
      activity.duration += endTime - activity.startTime;
    }

    activity.endTime = endTime;
    activity.status = "completed";
    activity.pausedAt = null;

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

const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      user: req.user.id,
    })
      .populate("task", "title")
      .sort({ createdAt: -1 });

    res.json({ activities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// const getDailySummary = async (req, res) => {
//   try {
//     // Start of today
//     const start = new Date();
//     start.setHours(0, 0, 0, 0);

//     // Start of tomorrow
//     const end = new Date(start);
//     end.setDate(end.getDate() + 1);

//     // Get ALL activities created today
//     const activities = await Activity.find({
//       user: req.user.id,
//       createdAt: {
//         $gte: start,
//         $lt: end,
//       },
//     });

//     // Get completed activities
//     const completedActivities =
//       activities.filter(
//         (activity) =>
//           activity.status === "completed"
//       );

//     // Calculate total tracked duration
//     const totalDuration =
//       completedActivities.reduce(
//         (total, activity) =>
//           total + activity.duration,
//         0
//       );

//     res.json({
//       date: start,

//       // All today's activities
//       activities,

//       // Only completed activities
//       completedActivities,

//       // Total milliseconds tracked today
//       totalDuration,
//     });

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       message: "Server error",
//     });

//   }
// };

const getDailySummary = async (req, res) => {
  try {
    // Start of today
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    // Start of tomorrow
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    console.log("TODAY START:", start);
console.log("TODAY END:", end);

    // Get all activities that started today
    const activities = await Activity.find({
      user: req.user.id,
      startTime: {
        $gte: start,
        $lt: end,
      },
    });
    console.log("TODAY ACTIVITIES:", activities);

    // Completed activities
    const completedActivities =
      activities.filter(
        (activity) =>
          activity.status === "completed"
      );

    // Calculate completed duration
    let totalDuration =
      completedActivities.reduce(
        (total, activity) =>
          total + activity.duration,
        0
      );

    // Find today's active/paused activity
    const currentActivity =
      activities.find(
        (activity) =>
          activity.status === "active" ||
          activity.status === "paused"
      );

    // If activity is currently running,
    // include its live duration
    if (
      currentActivity &&
      currentActivity.status === "active"
    ) {
      const now = new Date();

      const liveDuration =
        now - currentActivity.startTime;

      totalDuration +=
        currentActivity.duration +
        liveDuration;
    }

    // If paused, include already saved duration
    if (
      currentActivity &&
      currentActivity.status === "paused"
    ) {
      totalDuration +=
        currentActivity.duration;
    }

    res.json({
      date: start,
      activities,
      completedActivities,
      totalDuration,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
    });

  }
};
const getActiveActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({
      user: req.user.id,
      status: { $in: ["active", "paused"] },
    }).populate("task", "title");

    res.json({ activity });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  startActivity,
  pauseActivity,
  resumeActivity,
  stopActivity,
  getActivities,
  getDailySummary,
  getActiveActivity,
};