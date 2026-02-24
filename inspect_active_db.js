const mongoose = require('mongoose');
const Course = require('./backend/models/Course');
const User = require('./backend/models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function inspect() {
  try {
    console.log('Connecting to:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const courses = await Course.find().populate('instructorId', 'name email role');
    console.log(`Total courses found in ${process.env.MONGO_URI}: ${courses.length}`);
    
    courses.forEach((c, i) => {
      console.log(`\nCourse ${i + 1}:`);
      console.log(`- Title: ${c.title}`);
      console.log(`- ID: ${c._id}`);
      console.log(`- Instructor: ${c.instructorId ? c.instructorId.name + ' (' + c.instructorId.email + ')' : 'MISSING'}`);
      console.log(`- isApproved: ${c.isApproved}`);
    });

    const instructors = await User.find({ role: 'instructor' });
    console.log(`\nTotal Instructors: ${instructors.length}`);
    instructors.forEach(inst => {
        console.log(`- ${inst.name} (${inst.email}) ID: ${inst._id}`);
    });

    const admins = await User.find({ role: 'admin' });
    console.log(`\nTotal Admins: ${admins.length}`);
    admins.forEach(admin => {
        console.log(`- ${admin.name} (${admin.email}) ID: ${admin._id}`);
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

inspect();
