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
    const quizzes = await Quiz.find({ courseId: req.params.courseId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  // Logic for auto-scoring and unlocking next course
  try {
    const { answers, courseId } = req.body;
    const quizzes = await Quiz.find({ courseId });
    let score = 0;
    
    quizzes.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) score++;
    });

    const percentage = (score / quizzes.length) * 100;
    res.json({ score, percentage, passed: percentage >= 80 });
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
