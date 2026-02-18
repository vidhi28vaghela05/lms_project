const express = require('express');
const { createQuiz, getQuizzesByCourse, submitQuiz, deleteQuiz } = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, authorize('instructor', 'admin'), createQuiz);

router.route('/course/:courseId')
  .get(getQuizzesByCourse);

router.route('/submit')
  .post(protect, submitQuiz);

router.route('/:id')
  .delete(protect, authorize('instructor', 'admin'), deleteQuiz);

module.exports = router;
