const express = require('express');
const { createLesson, getLessonsByCourse, updateLesson, deleteLesson } = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, authorize('instructor', 'admin'), createLesson);

router.route('/course/:courseId')
  .get(getLessonsByCourse);

router.route('/:id')
  .put(protect, authorize('instructor', 'admin'), updateLesson)
  .delete(protect, authorize('instructor', 'admin'), deleteLesson);

module.exports = router;
