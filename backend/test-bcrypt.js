const bcrypt = require('bcryptjs');

async function testBcrypt() {
  try {
    console.log('Testing bcryptjs...');
    
    const password = 'test123';
    console.log('Hashing password:', password);
    
    const salt = await bcrypt.genSalt(10);
    console.log('Salt generated');
    
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed successfully');
    console.log('Hashed:', hashedPassword);
    
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password comparison:', isMatch);
    
    console.log('bcryptjs works fine!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testBcrypt();
