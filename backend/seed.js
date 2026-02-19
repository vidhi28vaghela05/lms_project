const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('✓ Cleared existing users');

    // Hash passwords
    const hashedPasswordStudent = await bcrypt.hash('password123', 10);
    const hashedPasswordInstructor = await bcrypt.hash('password123', 10);
    const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);

    // Create test users
    const testUsers = [
      {
        name: 'John Student',
        email: 'student@lms.com',
        password: hashedPasswordStudent,
        role: 'student',
        skills: ['JavaScript', 'React'],
        progressScore: 45
      },
      {
        name: 'Jane Instructor',
        email: 'instructor@lms.com',
        password: hashedPasswordInstructor,
        role: 'instructor',
        skills: ['Teaching', 'Curriculum Design'],
        progressScore: 80
      },
      {
        name: 'Admin User',
        email: 'admin@lms.com',
        password: hashedPasswordAdmin,
        role: 'admin',
        skills: ['System Management'],
        progressScore: 100
      }
    ];

    // Insert users without hashing (since passwords are already hashed)
    const users = await User.insertMany(testUsers);
    console.log('✓ Created test users:');
    
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });

    // Verify users
    const count = await User.countDocuments();
    console.log(`\n✓ Total users in database: ${count}`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Login Credentials:');
    console.log('  Student:    student@lms.com / password123');
    console.log('  Instructor: instructor@lms.com / password123');
    console.log('  Admin:      admin@lms.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
