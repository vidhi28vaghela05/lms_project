const express = require('express');
const { enrollStudent, getStudentEnrollments, updateProgress, getRecommendations } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:courseId', protect, enrollStudent);
router.get('/my-enrollments', protect, getStudentEnrollments);
router.put('/progress/:courseId', protect, updateProgress);
router.get('/recommendations', protect, getRecommendations);

module.exports = router;
