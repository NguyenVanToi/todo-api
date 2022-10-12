const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
}, {collection: 'task'});

const task = mongoose.model("task", TaskSchema);

module.exports = task;