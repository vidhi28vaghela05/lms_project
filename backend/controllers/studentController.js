const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');
const Certificate = require('../models/Certificate');
const Message = require('../models/Message');
const crypto = require('crypto');
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');

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

exports.editReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);
    
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    // Re-calculate course average
    const reviews = await Review.find({ courseId: review.courseId });
    const avg = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
    await mongoose.model('Course').findByIdAndUpdate(review.courseId, { 
      averageRating: avg,
      reviewCount: reviews.length
    });

    res.json(review);
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
    const enrollment = await Enrollment.findOne({ studentId: req.user.id, courseId })
      .populate('studentId', 'name')
      .populate('courseId', 'title');

    if (!enrollment || enrollment.progressPercentage < 100) {
      return res.status(400).json({ message: 'Course must be 100% completed' });
    }

    let certificate = await Certificate.findOne({ userId: req.user.id, courseId });
    if (!certificate) {
      const certificateHash = crypto.randomBytes(16).toString('hex');
      certificate = await Certificate.create({
        userId: req.user.id,
        courseId,
        certificateHash
      });
    }

    // Generate PDF
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate-${courseId}.pdf`);
    
    doc.pipe(res);

    // Design
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9fa');
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#1d3557');

    doc.fillColor('#1d3557').fontSize(40).text('CERTIFICATE OF COMPLETION', 0, 100, { align: 'center' });
    
    doc.moveDown();
    doc.fontSize(20).text('This is to certify that', { align: 'center' });
    
    doc.moveDown();
    doc.fillColor('#e63946').fontSize(30).text(enrollment.studentId.name.toUpperCase(), { align: 'center' });
    
    doc.moveDown();
    doc.fillColor('#1d3557').fontSize(20).text('has successfully completed the course', { align: 'center' });
    
    doc.moveDown();
    doc.fontSize(25).text(enrollment.courseId.title, { align: 'center' });
    
    doc.moveDown(2);
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, 100, 450);
    doc.text(`Verify at: lms-verify.id/${certificate.certificateHash}`, 100, 470);
    
    doc.text('AUTHORIZED SIGNATURE', 550, 450);
    doc.lineCap('butt').moveTo(550, 445).lineTo(750, 445).stroke();

    doc.end();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 }).populate('sender receiver', 'name role');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { message, receiverId, courseId } = req.body;
    
    // If receiverId is not provided, we might default to course instructor if courseId is present
    let finalReceiverId = receiverId;
    if (!finalReceiverId && courseId) {
      const course = await Course.findById(courseId);
      if (course) finalReceiverId = course.instructorId;
    }

    if (!finalReceiverId) return res.status(400).json({ message: 'Receiver identity required' });

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: finalReceiverId,
      message,
      courseId
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
