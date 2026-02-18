const User = require('../models/User');
const Course = require('../models/Course');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSystemAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalCourses = await Course.countDocuments({});
    
    // Engagement rate placeholder logic
    const users = await User.find({});
    const activeUsers = users.filter(u => u.role === 'student').length;
    const engagementRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

    res.json({
      totalUsers,
      totalCourses,
      engagementRate: Math.round(engagementRate)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
