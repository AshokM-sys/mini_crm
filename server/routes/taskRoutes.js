const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTaskStatus,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect); // All task routes require authentication

router.route('/')
  .get(getTasks)
  .post(createTask);

router.patch('/:id/status', updateTaskStatus);

module.exports = router;
