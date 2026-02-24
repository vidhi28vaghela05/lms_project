const express = require('express');
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getPopularCourses
} = require('../controllers/courseController');
const { protect, authorize, optionalProtect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', optionalProtect, getCourses);
router.post('/', protect, authorize('instructor', 'admin'), createCourse);

router.get('/popular', getPopularCourses);

router.route('/:id')
  .get(getCourseById)
  .put(protect, authorize('instructor', 'admin'), updateCourse)
  .delete(protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;
