const express = require('express');
const {
  getInstructorStats,
  getStudentPerformance,
  requestCourseUpdate,
  getCourseReviews,
  getPayoutHistory,
  updateProfile,
  changePassword,
  getMessages,
  sendMessage,
  getConversations
} = require('../controllers/instructorController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/stats', protect, authorize('instructor'), getInstructorStats);
router.get('/performance', protect, authorize('instructor'), getStudentPerformance);
router.post('/update-request', protect, authorize('instructor'), requestCourseUpdate);
router.get('/reviews', protect, authorize('instructor'), getCourseReviews);
router.get('/payouts', protect, authorize('instructor'), getPayoutHistory);
router.put('/update-profile', protect, authorize('instructor'), updateProfile);
router.put('/change-password', protect, authorize('instructor'), changePassword);
router.get('/messages', protect, authorize('instructor'), getMessages);
router.post('/messages', protect, authorize('instructor'), sendMessage);
router.get('/conversations', protect, authorize('instructor'), getConversations);

module.exports = router;
