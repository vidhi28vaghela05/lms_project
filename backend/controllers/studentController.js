const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');
const Certificate = require('../models/Certificate');
const crypto = require('crypto');

exports.getRecommendations = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    let level = 'beginner';
    if (student.progressScore > 75) level = 'advanced';
    else if (student.progressScore > 50) level = 'intermediate';

    const courses = await Course.find({ level, isApproved: true }).limit(5);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user.id }).populate({
      path: 'courseId',
      select: 'title thumbnail instructorId averageRating'
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user.id);
    
    const index = user.wishlist.indexOf(courseId);
    if (index === -1) {
      user.wishlist.push(courseId);
    } else {
      user.wishlist.splice(index, 1);
    }
    
    await user.save();
    res.json({ message: index === -1 ? 'Added to wishlist' : 'Removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    
    // Check if enrolled
    const enrolled = await Enrollment.findOne({ studentId: req.user.id, courseId });
    if (!enrolled) return res.status(403).json({ message: 'Must be enrolled to review' });

    const review = await Review.create({
      userId: req.user.id,
      courseId,
      rating,
      comment
    });

    // Update course average rating
    const course = await Course.findById(courseId);
    const reviews = await Review.find({ courseId });
    const avg = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
    
    course.averageRating = avg;
    course.reviewCount = reviews.length;
    await course.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateModuleProgress = async (req, res) => {
  try {
    const { courseId, lessonId, completed } = req.body;
    const enrollment = await Enrollment.findOne({ studentId: req.user.id, courseId });
    
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    // Assuming enrollment track completedLessons
    if (completed) {
      if (!enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
      }
    } else {
      enrollment.completedLessons = enrollment.completedLessons.filter(id => id.toString() !== lessonId);
    }

    // Update progress percentage
    // Need total lessons count
    const totalLessons = await mongoose.model('Lesson').countDocuments({ courseId });
    enrollment.progressPercentage = (enrollment.completedLessons.length / totalLessons) * 100;
    
    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({ studentId: req.user.id, courseId });

    if (!enrollment || enrollment.progressPercentage < 100) {
      return res.status(400).json({ message: 'Course must be 100% completed' });
    }

    const existingCert = await Certificate.findOne({ userId: req.user.id, courseId });
    if (existingCert) return res.json(existingCert);

    const certificateHash = crypto.randomBytes(16).toString('hex');
    const certificate = await Certificate.create({
      userId: req.user.id,
      courseId,
      certificateHash
    });

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
