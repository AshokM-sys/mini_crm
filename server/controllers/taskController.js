const Task = require('../models/Task');

//get all tasks
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

//create new task
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

//update task status
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
