const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const mongoose = require('mongoose');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, skillsCovered, level, thumbnail, status } = req.body;
    const course = await Course.create({
      title,
      description,
      price,
      instructorId: req.user.id,
      skillsCovered,
      level,
      thumbnail,
      status
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const { keyword, level, minPrice, maxPrice, skills } = req.query;
    let query = { isApproved: true };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (level) query.level = level;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (skills) {
      const skillsArray = skills.split(',');
      query.skillsCovered = { $in: skillsArray };
    }

    // Unified Authorization-based filtering
    if (req.user) {
      if (req.user.role === 'admin') {
        delete query.isApproved;
      } else if (req.user.role === 'instructor') {
        const instructorId = req.user.id;
        const visibilityFilter = {
          $or: [
            { isApproved: true },
            { instructorId: instructorId }
          ]
        };
        
        // If query already has an $or (from keyword), we need to AND them
        if (query.$or) {
          query.$and = [
            { $or: query.$or },
            visibilityFilter
          ];
          delete query.$or;
        } else {
          query = { ...query, ...visibilityFilter };
        }
        delete query.isApproved;
      }
    }

    const courses = await Course.find(query).populate('instructorId', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPopularCourses = async (req, res) => {
  try {
    // Top 10 by enrollment count
    const popularData = await Enrollment.aggregate([
      { $group: { _id: "$courseId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const courseIds = popularData.map(p => p._id);
    const courses = await Course.find({ _id: { $in: courseIds }, isApproved: true })
      .populate('instructorId', 'name email');
    
    // Tag them in DB if needed (optional, but requested "popular tag for top 10")
    // We can just return them with a flag or update the DB
    await Course.updateMany({ _id: { $in: courseIds } }, { isPopular: true });
    await Course.updateMany({ _id: { $nin: courseIds } }, { isPopular: false });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructorId', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
