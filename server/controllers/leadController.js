const Lead = require('../models/Lead');

// @desc    Get all leads with pagination, search, and filtering (excluding soft-deleted)
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const searchQuery = req.query.search || '';
    const statusFilter = req.query.status || '';

    // Base query: Must not be soft-deleted
    const filterConditions = {
      isDeleted: false,
    };

    // Filter by status if provided and not 'All'
    if (statusFilter && statusFilter !== 'All') {
      filterConditions.status = statusFilter;
    }

    // Search by name, email, or phone
    if (searchQuery) {
      filterConditions.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { phone: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    // Fetch leads and total count in parallel
    const [leads, total] = await Promise.all([
      Lead.find(filterConditions)
        .populate('assignedTo', 'name email')
        .populate('company', 'name industry location')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Lead.countDocuments(filterConditions),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.json({
      leads,
      currentPage: page,
      totalPages,
      totalLeads: total,
    });
  } catch (error) {
    console.error('Error fetching leads:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get single lead by ID
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, isDeleted: false })
      .populate('assignedTo', 'name email')
      .populate('company', 'name industry location');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  try {
    const { name, email, phone, status, assignedTo, company } = req.body;

    if (!name || !email || !phone || !assignedTo || !company) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      status: status || 'New',
      assignedTo,
      company,
    });

    const populatedLead = await Lead.findById(lead._id)
      .populate('assignedTo', 'name email')
      .populate('company', 'name industry location');

    res.status(201).json(populatedLead);
  } catch (error) {
    console.error('Error creating lead:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Update an existing lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, isDeleted: false });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const { name, email, phone, status, assignedTo, company } = req.body;

    lead.name = name ?? lead.name;
    lead.email = email ?? lead.email;
    lead.phone = phone ?? lead.phone;
    lead.status = status ?? lead.status;
    lead.assignedTo = assignedTo ?? lead.assignedTo;
    lead.company = company ?? lead.company;

    await lead.save();

    const updatedLead = await Lead.findById(lead._id)
      .populate('assignedTo', 'name email')
      .populate('company', 'name industry location');

    res.json(updatedLead);
  } catch (error) {
    console.error('Error updating lead:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Soft delete a lead (must not appear in normal queries)
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, isDeleted: false });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Perform soft delete
    lead.isDeleted = true;
    await lead.save();

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
};
