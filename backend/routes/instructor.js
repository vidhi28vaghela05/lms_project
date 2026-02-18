const express = require('express');
const { getInstructorStats, getStudentPerformance } = require('../controllers/instructorController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/stats', protect, authorize('instructor'), getInstructorStats);
router.get('/student-performance', protect, authorize('instructor'), getStudentPerformance);

module.exports = router;
