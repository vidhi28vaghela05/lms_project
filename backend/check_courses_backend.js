const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Course = require('./models/Course');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        
        const courses = await Course.find().populate('instructorId', 'name role');
        console.log('Total Courses:', courses.length);
        courses.forEach(c => {
            console.log(`- ${c.title} (ID: ${c._id}) | Instructor: ${c.instructorId?.name} (ID: ${c.instructorId?._id}) | Role: ${c.instructorId?.role} | Approved: ${c.isApproved}`);
        });

        const instructors = await User.find({ role: 'instructor' });
        console.log('\nInstructors:');
        instructors.forEach(i => {
            console.log(`- ${i.name} (ID: ${i._id}) | Status: ${i.status}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
