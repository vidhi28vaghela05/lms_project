const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

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

    res.json({
      totalEnrollments,
      avgScore: Math.round(avgScore),
      completionRate: Math.round(completionRate),
      totalCourses: instructorCourses.length
    });
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
