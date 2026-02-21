const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Payout = require('../models/Payout');
const User = require('../models/User');
const Review = require('../models/Review');
const Enrollment = require('../models/Enrollment');

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
