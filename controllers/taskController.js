const Task = require("../models/Task");
const Activity = require("../models/Activity");
//CRUD for tasks:
// CREATE TASK
const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const task = await Task.create({
      user: req.user.id,
      title: title.trim(),
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET USER TASKS
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    // Add total tracked time for each task
    const tasksWithTotalTime = await Promise.all(
      tasks.map(async (task) => {
        const totalResult = await Activity.aggregate([
          {
            $match: {
              user: task.user,
              task: task._id,
              status:"completed",
           },
          },
          {
            $group: {
              _id: null,
              totalTracked: {
                $sum: "$duration",
              },
            },
          },
        ]);

        return {
          ...task.toObject(),
          totalTracked:
            totalResult.length > 0
              ? totalResult[0].totalTracked
              : 0,
        };
      })
    );

    res.status(200).json({
      tasks: tasksWithTotalTime,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const { title, status } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Update title if provided
    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Task title cannot be empty",
        });
      }

      task.title = title.trim();
    }

    // Update status if provided
    if (status !== undefined) {
      if (!["pending", "completed"].includes(status)) {
        return res.status(400).json({
          message: "Status must be pending or completed",
        });
      }

      task.status = status;
    }

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Delete all activities related to this task
    await Activity.deleteMany({
      task: task._id,
      user: req.user.id,
    });

    res.status(200).json({
      message: "Task and related activities deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};