const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
    },
    industry: {
      type: String,
      required: [true, 'Please provide industry'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Company', companySchema);
