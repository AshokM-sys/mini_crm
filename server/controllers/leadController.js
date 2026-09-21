const Lead = require('../models/Lead');

//get all the leads
const getLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const searchQuery = req.query.search || '';
    const statusFilter = req.query.status || '';

    // Not deleted
    const filterConditions = {
      isDeleted: false,
    };

    // got filtered
    if (statusFilter && statusFilter !== 'All') {
      filterConditions.status = statusFilter;
    }

    // Search
    if (searchQuery) {
      filterConditions.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { phone: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    // fetched the leads and total count in parallel
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

//get single lead by Id
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

//create new lead
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

//update lead
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

//soft delete the lead
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, isDeleted: false });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

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
