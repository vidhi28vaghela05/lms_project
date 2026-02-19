const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const debugDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`\n✓ Total users in database: ${users.length}`);
    
    if (users.length > 0) {
      console.log('\nUsers in database:');
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.role})`);
      });

      // Test password comparison
      console.log('\n--- Password Verification Test ---');
      const testUser = users[0];
      console.log(`Testing user: ${testUser.email}`);
      console.log(`Password in DB (hashed): ${testUser.password}`);
      
      const isValid = await testUser.comparePassword('password123');
      console.log(`Comparing 'password123': ${isValid}`);
      
    } else {
      console.log('⚠ No users found in database!');
      console.log('Run: npm run seed');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

debugDB();
