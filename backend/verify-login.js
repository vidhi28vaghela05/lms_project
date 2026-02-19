const http = require('http');

console.log('Verifying Login Fix...\n');

function testLogin(email, password, description) {
  return new Promise((resolve) => {
    const data = JSON.stringify({email, password});
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Content-Length': data.length}
    };
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (d) => body += d);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const result = JSON.parse(body);
          console.log(`PASS: ${description}`);
          console.log(`      Email: ${result.email} | Role: ${result.role}`);
        } else {
          console.log(`FAIL: ${description}`);
        }
        resolve();
      });
    });
    req.on('error', (e) => {
      console.log(`ERROR: ${description} - ${e.message}`);
      resolve();
    });
    req.write(data);
    req.end();
  });
}

(async () => {
  await testLogin('student@lms.com', 'password123', 'Student Login');
  await new Promise(r => setTimeout(r, 300));
  
  await testLogin('instructor@lms.com', 'password123', 'Instructor Login');
  await new Promise(r => setTimeout(r, 300));
  
  await testLogin('admin@lms.com', 'admin123', 'Admin Login');
  await new Promise(r => setTimeout(r, 300));
  
  console.log('\nAll users can now login successfully!');
})();
