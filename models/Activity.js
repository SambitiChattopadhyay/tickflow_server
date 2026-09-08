const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      default: null,
    },

    duration: {
      type: Number,
      default: 0,
    },
    //pause logic handling
    pausedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["active","paused", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", activitySchema);