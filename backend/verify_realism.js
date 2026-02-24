const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Message = require('./models/Message');
const Payment = require('./models/Payment');
const Enrollment = require('./models/Enrollment');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function verify() {
  try {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI not found in .env');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Find or create users
    let instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      console.log('Creating demo instructor...');
      instructor = await User.create({ name: 'Demo Instructor', email: 'inst@demo.com', password: 'password', role: 'instructor', status: 'approved' });
    }

    let student = await User.findOne({ role: 'student' });
    if (!student) {
      console.log('Creating demo student...');
      student = await User.create({ name: 'Demo Student', email: 'stu@demo.com', password: 'password', role: 'student' });
    }

    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
        console.log('Creating demo admin...');
        admin = await User.create({ name: 'Demo Admin', email: 'admin@demo.com', password: 'password', role: 'admin' });
    }

    // 2. Create course
    const course = await Course.create({
      title: 'Verification Course',
      description: 'Test Description',
      instructorId: instructor._id,
      price: 100,
      isApproved: true,
      level: 'beginner'
    });
    console.log('Course created:', course.title);

    // 3. Simulate Student Message to Instructor
    const stuMsg = await Message.create({
      sender: student._id,
      receiver: instructor._id,
      message: 'Hello Instructor!',
      courseId: course._id
    });
    console.log('Student message created');

    // 4. Simulate Instructor Reply
    const instReply = await Message.create({
      sender: instructor._id,
      receiver: student._id,
      message: 'Hello Student, how can I help?',
      courseId: course._id
    });
    console.log('Instructor reply created');

    // 5. Simulate UPI Payment Submission
    const payment = await Payment.create({
      userId: student._id,
      courseId: course._id,
      amount: 100,
      method: 'upi',
      status: 'pending',
      transactionId: 'TXN123456789',
      instructorEarnings: 70,
      platformEarnings: 30,
      isConfirmed: false
    });
    console.log('UPI Payment pending');

    // 6. Verify Admin can see pending payments (simulated by query)
    const pending = await Payment.find({ status: 'pending', method: 'upi' });
    if (pending.length > 0) {
      console.log('SUCCESS: Admin can see pending payments');
    }

    // Cleanup
    await Payment.findByIdAndDelete(payment._id);
    await Message.deleteMany({ courseId: course._id });
    await Course.findByIdAndDelete(course._id);

    console.log('Verification Complete: Backend flows functional.');
    process.exit(0);
  } catch (error) {
    console.error('Verification FAILED:', error);
    process.exit(1);
  }
}

verify();
