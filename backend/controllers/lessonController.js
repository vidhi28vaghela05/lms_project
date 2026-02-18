const Lesson = require('../models/Lesson');

exports.createLesson = async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.courseId }).sort('order');
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lesson removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
