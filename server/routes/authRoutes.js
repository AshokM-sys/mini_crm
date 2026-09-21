const express = require('express');
const router = express.Router();
const {
  loginUser,
  getMe,
  getUsers,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);

module.exports = router;
