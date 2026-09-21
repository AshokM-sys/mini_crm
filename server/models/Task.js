const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide task title'],
      trim: true,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: [true, 'Please associate task with a lead'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please assign task to a user'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide due date'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);
