const express = require('express');
const {
  getInstructorStats,
  getStudentPerformance,
  requestCourseUpdate,
  getCourseReviews,
  getPayoutHistory
} = require('../controllers/instructorController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/stats', protect, authorize('instructor'), getInstructorStats);
router.get('/performance', protect, authorize('instructor'), getStudentPerformance);
router.post('/update-request', protect, authorize('instructor'), requestCourseUpdate);
router.get('/reviews', protect, authorize('instructor'), getCourseReviews);
router.get('/payouts', protect, authorize('instructor'), getPayoutHistory);

module.exports = router;
