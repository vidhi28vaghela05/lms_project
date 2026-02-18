const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const router = express.Router();

// Get personalized recommendations
router.get('/recommendations', protect, authorize('student'), async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    let difficulty = 'beginner';
    
    if (student.progressScore > 75) difficulty = 'advanced';
    else if (student.progressScore > 50) difficulty = 'intermediate';

    const courses = await Course.find({ difficultyLevel: difficulty }).limit(5);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get enrolled courses and progress
router.get('/my-courses', protect, authorize('student'), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user.id }).populate('courseId');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enroll in a course
router.post('/enroll/:courseId', protect, authorize('student'), async (req, res) => {
  try {
    const enrollment = await Enrollment.create({
      studentId: req.user.id,
      courseId: req.params.courseId
    });
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
