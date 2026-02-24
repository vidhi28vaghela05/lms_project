const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Payout = require('../models/Payout');
const User = require('../models/User');
const Review = require('../models/Review');
const Enrollment = require('../models/Enrollment');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs');

exports.getInstructorStats = async (req, res) => {
  try {
    const instructorCourses = await Course.find({ instructorId: req.user.id });
    const courseIds = instructorCourses.map(c => c._id);

    const enrollments = await Enrollment.find({ courseId: { $in: courseIds } });
    
    // Aggregates
    const totalEnrollments = enrollments.length;
    const avgScore = totalEnrollments > 0 
      ? enrollments.reduce((acc, curr) => acc + curr.performanceScore, 0) / totalEnrollments 
      : 0;
    
    // Completion rate (progress percentage == 100)
    const completed = enrollments.filter(e => e.progressPercentage === 100).length;
    const completionRate = totalEnrollments > 0 ? (completed / totalEnrollments) * 100 : 0;

    const instructor = await User.findById(req.user.id);

    res.json({
      totalEnrollments,
      avgScore: Math.round(avgScore),
      completionRate: Math.round(completionRate),
      totalCourses: instructorCourses.length,
      payableAmount: instructor.payableAmount,
      status: instructor.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestCourseUpdate = async (req, res) => {
  try {
    const { courseId, description, pendingData } = req.body;
    const course = await Course.findOne({ _id: courseId, instructorId: req.user.id });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.updateRequest = {
      description,
      pendingData,
      status: 'pending'
    };

    await course.save();
    res.json({ message: 'Update request sent to admin for approval' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseReviews = async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.user.id });
    const courseIds = courses.map(c => c._id);
    const reviews = await Review.find({ courseId: { $in: courseIds } })
      .populate('userId', 'name')
      .populate('courseId', 'title');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPayoutHistory = async (req, res) => {
  try {
    const payouts = await Payout.find({ instructorId: req.user.id }).sort({ createdAt: -1 });
    res.json(payouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentPerformance = async (req, res) => {
  try {
    const instructorCourses = await Course.find({ instructorId: req.user.id });
    const courseIds = instructorCourses.map(c => c._id);
    const performance = await Enrollment.find({ courseId: { $in: courseIds } })
      .populate('studentId', 'name email')
      .populate('courseId', 'title');
    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, upiId, registrationDescription } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (upiId) user.upiId = upiId;
    if (registrationDescription) user.registrationDescription = registrationDescription;

    await user.save();
    res.json({ message: 'Profile updated successfully', user: { name: user.name, email: user.email, upiId: user.upiId } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Invalid current password' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 }).populate('sender receiver', 'name role');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { message, receiverId, courseId } = req.body;
    
    let finalReceiverId = receiverId;
    if (!finalReceiverId) {
      let admin = await User.findOne({ role: 'admin' });
      if (!admin) return res.status(404).json({ message: 'Admin not found' });
      finalReceiverId = admin._id;
    }

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: finalReceiverId,
      message,
      courseId
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
    .sort({ createdAt: -1 })
    .populate('sender receiver', 'name role');

    // Grouping logic for "speedy" dashboard access
    const conversations = {};
    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === req.user.id ? msg.receiver : msg.sender;
      if (!conversations[otherUser._id]) {
        conversations[otherUser._id] = {
          user: otherUser,
          lastMessage: msg.message,
          timestamp: msg.createdAt,
          unread: !msg.read && msg.receiver._id.toString() === req.user.id
        };
      }
    });

    res.json(Object.values(conversations));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
