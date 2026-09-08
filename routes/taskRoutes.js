const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");


// CREATE TASK
router.post("/", protect, createTask);

// GET USER TASKS
router.get("/", protect, getTasks);

// UPDATE TASK STATUS
router.put("/:id", protect, updateTaskStatus);

// DELETE TASK
router.delete("/:id", protect, deleteTask);


module.exports = router;