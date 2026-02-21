const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');

exports.createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizzesByCourse = async (req, res) => {
  try {
    const { lessonId } = req.query;
    const filter = { courseId: req.params.courseId };
    if (lessonId) filter.lessonId = lessonId;
    
    const quizzes = await Quiz.find(filter);
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { answers, courseId, lessonId } = req.body;
    const filter = { courseId };
    if (lessonId) filter.lessonId = lessonId;
    
    const quizzes = await Quiz.find(filter);
    let score = 0;
    
    quizzes.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) score++;
    });

    const percentage = quizzes.length > 0 ? (score / quizzes.length) * 100 : 0;
    
    let recommendations = [];
    let unlocked = [];

    const currentCourse = await mongoose.model('Course').findById(courseId);

    if (percentage < 50) {
      // Recommend beginner courses in the same skill area
      recommendations = await mongoose.model('Course').find({
        level: 'beginner',
        skillsCovered: { $in: currentCourse.skillsCovered },
        _id: { $ne: courseId }
      }).limit(2);
    } else if (percentage >= 80) {
      // Unlock next level courses
      const nextLevel = currentCourse.level === 'beginner' ? 'intermediate' : 'advanced';
      unlocked = await mongoose.model('Course').find({
        level: nextLevel,
        skillsCovered: { $in: currentCourse.skillsCovered }
      }).limit(2);
    }

    res.json({ 
      score, 
      percentage, 
      passed: percentage >= 80,
      recommendations,
      unlocked
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
