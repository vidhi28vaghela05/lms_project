const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

async function inspect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const courses = await Course.find().populate('instructorId', 'name email role');
    console.log(`Total courses found: ${courses.length}`);
    
    courses.forEach((c, i) => {
      console.log(`\nCourse ${i + 1}:`);
      console.log(`- Title: ${c.title}`);
      console.log(`- ID: ${c._id}`);
      console.log(`- Instructor: ${c.instructorId ? c.instructorId.name + ' (' + c.instructorId.email + ')' : 'MISSING'}`);
      console.log(`- Instructor ID: ${c.instructorId ? c.instructorId._id : 'N/A'}`);
      console.log(`- isApproved: ${c.isApproved}`);
      console.log(`- Price: ${c.price}`);
    });

    const instructors = await User.find({ role: 'instructor' });
    console.log(`\nTotal Instructors: ${instructors.length}`);
    instructors.forEach(inst => {
        console.log(`- ${inst.name} (${inst.email}) ID: ${inst._id}`);
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

inspect();
