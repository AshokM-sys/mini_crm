const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('lead', 'name email status')
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, lead, assignedTo, dueDate, status } = req.body;

    if (!title || !lead || !assignedTo || !dueDate) {
      return res.status(400).json({ message: 'Please provide all required task fields' });
    }

    const task = await Task.create({
      title,
      lead,
      assignedTo,
      dueDate,
      status: status || 'Pending',
    });

    const populatedTask = await Task.findById(task._id)
      .populate('lead', 'name email status')
      .populate('assignedTo', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Error creating task:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Update task status (Strict Rule: Only assigned user can update)
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // MANDATORY AUTHORIZATION CHECK:
    // Only the user assigned to this task is permitted to update its status
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Forbidden: Only the assigned user is authorized to update the status of this task.',
      });
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('lead', 'name email status')
      .populate('assignedTo', 'name email');

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task status:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTaskStatus,
};
