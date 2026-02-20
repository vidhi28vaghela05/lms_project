const http = require('http');

async function testSkillCreation() {
  // 1. Login as admin to get token
  const loginData = JSON.stringify({
    email: 'admin@lms.com',
    password: 'admin123'
  });

  const loginOptions = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  };

  const token = await new Promise((resolve, reject) => {
    const req = http.request(loginOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(body).token);
        } else {
          reject('Login failed: ' + body);
        }
      });
    });
    req.on('error', reject);
    req.write(loginData);
    req.end();
  });

  console.log('✓ Logged in as admin');

  // 2. Try to create a skill
  const skillData = JSON.stringify({
    skillName: 'Test Skill ' + Date.now(),
    description: 'This is a test skill',
    difficultyLevel: 'beginner'
  });

  const skillOptions = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/skills',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': skillData.length,
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(skillOptions, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Body:', body);
    });
  });

  req.on('error', (e) => {
    console.error('Problem with request:', e.message);
  });

  req.write(skillData);
  req.end();
}

testSkillCreation().catch(console.error);
