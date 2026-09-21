const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide lead name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please assign lead to a user'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Please select a company'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lead', leadSchema);
