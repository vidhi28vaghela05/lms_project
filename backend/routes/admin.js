const express = require('express');
const { 
  getAllUsers, 
  getSystemAnalytics, 
  updateInstructorStatus, 
  approveCourse, 
  handleCourseUpdateRequest,
  confirmManualPayment,
  getPendingPayments,
  getPayoutRecords,
  processPayout,
  deleteReview,
  getAllReviews,
  getCategories,
  createCategory,
  deleteCategory,
  getSettings,
  updateSetting,
  deleteUser,
  updateUser,
  toggleUserStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/analytics', protect, authorize('admin'), getSystemAnalytics);
router.get('/payments/pending', protect, authorize('admin'), getPendingPayments);
router.post('/approve-instructor', protect, authorize('admin'), updateInstructorStatus);
router.post('/approve-course/:courseId', protect, authorize('admin'), approveCourse);
router.post('/course-update', protect, authorize('admin'), handleCourseUpdateRequest);
router.post('/confirm-payment', protect, authorize('admin'), confirmManualPayment);
router.get('/payouts', protect, authorize('admin'), getPayoutRecords);
router.post('/process-payout', protect, authorize('admin'), processPayout);
router.get('/reviews', protect, authorize('admin'), getAllReviews);
router.delete('/review/:id', protect, authorize('admin'), deleteReview);
router.get('/categories', protect, authorize('admin'), getCategories);
router.post('/categories', protect, authorize('admin'), createCategory);
router.delete('/categories/:id', protect, authorize('admin'), deleteCategory);
router.get('/settings', protect, authorize('admin'), getSettings);
router.post('/settings', protect, authorize('admin'), updateSetting);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.patch('/users/:id/toggle-status', protect, authorize('admin'), toggleUserStatus);

module.exports = router;
