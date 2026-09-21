const Lead = require('../models/Lead');
const Task = require('../models/Task');

// @desc    Get dashboard statistics using MongoDB aggregation
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Aggregations executed on MongoDB
    const [
      totalLeadsResult,
      qualifiedLeadsResult,
      tasksDueTodayResult,
      completedTasksResult,
    ] = await Promise.all([
      // 1. Total leads (excluding soft-deleted)
      Lead.aggregate([
        { $match: { isDeleted: false } },
        { $count: 'count' },
      ]),
      // 2. Qualified leads (status = Qualified)
      Lead.aggregate([
        { $match: { isDeleted: false, status: 'Qualified' } },
        { $count: 'count' },
      ]),
      // 3. Tasks due today
      Task.aggregate([
        { $match: { dueDate: { $gte: startOfDay, $lte: endOfDay } } },
        { $count: 'count' },
      ]),
      // 4. Completed tasks
      Task.aggregate([
        { $match: { status: 'Completed' } },
        { $count: 'count' },
      ]),
    ]);

    res.json({
      totalLeads: totalLeadsResult[0]?.count || 0,
      qualifiedLeads: qualifiedLeadsResult[0]?.count || 0,
      tasksDueToday: tasksDueTodayResult[0]?.count || 0,
      completedTasks: completedTasksResult[0]?.count || 0,
    });
  } catch (error) {
    console.error('Dashboard aggregation error:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getDashboardStats,
};
