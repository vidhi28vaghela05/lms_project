const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Payout = require('../models/Payout');
const Review = require('../models/Review');
const Category = require('../models/Category');
const SystemSetting = require('../models/SystemSetting');
const { sendPayoutConfirmation } = require('../utils/emailService');

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
    const totalStudents = await User.countDocuments({ role: 'student' });
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

    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalPayable = await User.aggregate([
      { $match: { role: 'instructor' } },
      { $group: { _id: null, total: { $sum: "$payableAmount" } } }
    ]);

    res.json({
      totalUsers,
      totalStudents,
      totalCourses,
      totalInstructors,
      todayIncome: todayIncome[0]?.total || 0,
      monthIncome: monthIncome[0]?.total || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalPayable: totalPayable[0]?.total || 0
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

    const course = await Course.findById(payment.courseId);
    const instructor = await User.findById(course.instructorId);
    if (instructor) {
      instructor.payableAmount += payment.instructorEarnings;
      await instructor.save();
    }

    const Enrollment = require('../models/Enrollment');
    await Enrollment.create({
      studentId: payment.userId,
      courseId: payment.courseId
    });

    res.json({ message: 'Payment confirmed & Balance updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'pending', method: 'upi' })
      .populate('userId', 'name email')
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPayoutRecords = async (req, res) => {
  try {
    const payouts = await Payout.find().populate('instructorId', 'name email upiId');
    res.json(payouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.processPayout = async (req, res) => {
  try {
    const { instructorId, amount, transactionRef } = req.body;
    const instructor = await User.findById(instructorId);
    
    if (!instructor || instructor.payableAmount < amount) {
      return res.status(400).json({ message: 'Invalid payout amount or instructor' });
    }

    await Payout.create({
      instructorId,
      amount,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      status: 'paid',
      transactionRef,
      payoutDate: new Date()
    });

    instructor.payableAmount -= amount;
    await instructor.save();

    // Send email notification
    await sendPayoutConfirmation(instructor.email, amount, transactionRef);

    // Add System Notification
    const Message = require('../models/Message');
    await Message.create({
      sender: req.user.id,
      receiver: instructorId,
      message: `System Alert: A payout of $${amount} has been processed (Ref: ${transactionRef}).`,
      isSystemNotification: true
    });

    res.json({ message: 'Payout processed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    // Recalculate average
    const reviews = await Review.find({ courseId: review.courseId });
    const avg = reviews.length > 0 ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length : 0;
    
    await Course.findByIdAndUpdate(review.courseId, {
      averageRating: avg,
      reviewCount: reviews.length
    });

    res.json({ message: 'Review moderated and removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name')
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await SystemSetting.find();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await SystemSetting.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true }
    );
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
