const express = require('express');
const {
  getRecommendations,
  getMyCourses,
  toggleWishlist,
  getWishlist,
  addReview,
  updateModuleProgress,
  generateCertificate
} = require('../controllers/studentController');

const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/recommendations', protect, authorize('student'), getRecommendations);
router.get('/my-courses', protect, authorize('student'), getMyCourses);
router.get('/wishlist', protect, authorize('student'), getWishlist);
router.post('/wishlist/toggle', protect, authorize('student'), toggleWishlist);
router.post('/review', protect, authorize('student'), addReview);
router.post('/progress', protect, authorize('student'), updateModuleProgress);
router.get('/certificate/:courseId', protect, authorize('student'), generateCertificate);

module.exports = router;
