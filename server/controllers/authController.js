const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = email ? email.trim().toLowerCase() : '';

    // Find user by email
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('GetMe error:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get all users for dropdown lists
// @route   GET /api/auth/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email');
    res.json(users);
  } catch (error) {
    console.error('GetUsers error:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  loginUser,
  getMe,
  getUsers,
};
