const express = require('express');
const { 
  getAllUsers, 
  getSystemAnalytics, 
  updateInstructorStatus, 
  approveCourse, 
  handleCourseUpdateRequest,
  confirmManualPayment
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/analytics', protect, authorize('admin'), getSystemAnalytics);
router.post('/approve-instructor', protect, authorize('admin'), updateInstructorStatus);
router.post('/approve-course/:courseId', protect, authorize('admin'), approveCourse);
router.post('/course-update', protect, authorize('admin'), handleCourseUpdateRequest);
router.post('/confirm-payment', protect, authorize('admin'), confirmManualPayment);

module.exports = router;
