const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Payout = require('../models/Payout');
const Review = require('../models/Review');

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
    const totalInstructors = await User.countDocuments({ role: 'instructor', status: 'approved' });
    
    // Income calculation
    const today = new Date();
    today.setHours(0,0,0,0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayIncome = await Payment.aggregate([
      { $match: { createdAt: { $gte: today }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: "$platformEarnings" } } }
    ]);

    const monthIncome = await Payment.aggregate([
      { $match: { createdAt: { $gte: monthStart }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: "$platformEarnings" } } }
    ]);

    res.json({
      totalUsers,
      totalCourses,
      totalInstructors,
      todayIncome: todayIncome[0]?.total || 0,
      monthIncome: monthIncome[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInstructorStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.status = status;
    await user.save();
    res.json({ message: `Instructor status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    course.isApproved = true;
    await course.save();
    res.json({ message: 'Course approved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.handleCourseUpdateRequest = async (req, res) => {
  try {
    const { courseId, action } = req.body; // action: 'approve' or 'reject'
    const course = await Course.findById(courseId);
    if (!course || !course.updateRequest) return res.status(404).json({ message: 'Request not found' });

    if (action === 'approve') {
      const data = course.updateRequest.pendingData;
      Object.keys(data).forEach(key => {
        course[key] = data[key];
      });
      course.updateRequest.status = 'approved';
    } else {
      course.updateRequest.status = 'rejected';
    }

    await course.save();
    res.json({ message: `Course update ${action}d` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.confirmManualPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });

    payment.status = 'completed';
    payment.isConfirmed = true;
    await payment.save();

    // Find course to get instructor
    const course = await Course.findById(payment.courseId);
    if (!course) return res.status(404).json({ message: 'Course associated with payment not found' });

    // Update instructor payable balance
    const instructor = await User.findById(course.instructorId);
    if (instructor) {
      instructor.payableAmount += payment.instructorEarnings;
      await instructor.save();
    }

    // Create Enrollment for the student
    const Enrollment = require('../models/Enrollment');
    await Enrollment.create({
      studentId: payment.userId,
      courseId: payment.courseId
    });

    res.json({ message: 'Payment confirmed, enrollment created, and instructor balance updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
