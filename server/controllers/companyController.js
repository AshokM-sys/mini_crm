const Company = require('../models/Company');
const Lead = require('../models/Lead');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get single company details and its associated leads
// @route   GET /api/companies/:id
// @access  Private
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Find all non-deleted leads associated with this company
    const leads = await Lead.find({
      company: company._id,
      isDeleted: false,
    }).populate('assignedTo', 'name email');

    res.json({
      company,
      leads,
    });
  } catch (error) {
    console.error('Error fetching company details:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Create a new company
// @route   POST /api/companies
// @access  Private
const createCompany = async (req, res) => {
  try {
    const { name, industry, location } = req.body;

    if (!name || !industry || !location) {
      return res.status(400).json({ message: 'Please provide all company fields' });
    }

    const company = await Company.create({
      name,
      industry,
      location,
    });

    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  createCompany,
};
