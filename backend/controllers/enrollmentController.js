const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Skill = require('../models/Skill');

exports.enrollStudent = async (req, res) => {
  try {
    const enrollment = await Enrollment.create({
      studentId: req.user.id,
      courseId: req.params.courseId
    });
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user.id }).populate('courseId');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOneAndUpdate(
      { studentId: req.user.id, courseId: req.params.courseId },
      { progressPercentage: req.body.progress },
      { new: true }
    );
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user.id }).populate('courseId');
    
    // Logic: If last quiz score < 50%, suggest courses with prerequisite skills
    // If avg score > 80%, suggest advanced level courses
    
    let avgScore = 0;
    if (enrollments.length > 0) {
      avgScore = enrollments.reduce((acc, curr) => acc + curr.performanceScore, 0) / enrollments.length;
    }

    let query = {};
    if (avgScore > 80) {
      query.level = 'advanced';
    } else if (avgScore < 50 && enrollments.length > 0) {
      // Find courses that are beginner or intermediate
      query.level = { $in: ['beginner', 'intermediate'] };
    } else {
      query.level = 'beginner';
    }

    const recommendations = await Course.find(query).limit(5);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
