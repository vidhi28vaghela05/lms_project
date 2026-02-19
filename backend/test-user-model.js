const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Test User model directly
const User = require('./models/User');

async function testRegistration() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    console.log('Hashing password...');
    const plainPassword = 'test123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    console.log('Creating test user...');
    const user = await User.create({
      name: 'Test User',
      email: `test${Date.now()}@test.com`,
      password: hashedPassword,
      role: 'student'
    });

    console.log('User created successfully!');
    console.log('User ID:', user._id);
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Role:', user.role);

    // Test password comparison
    const isValid = await user.comparePassword(plainPassword);
    console.log('Password verification:', isValid);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
}

testRegistration();
