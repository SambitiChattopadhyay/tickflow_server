const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");


// CREATE TASK
router.post("/", protect, createTask);

// GET USER TASKS
router.get("/", protect, getTasks);

// UPDATE TASK
router.put("/:id", protect, updateTask);

// DELETE TASK
router.delete("/:id", protect, deleteTask);


module.exports = router;