const http = require('http');

const testData = {name: 'Vidhi Vaghela', email: 'vidhi28vaghela05@gmail.com', password: 'vidhi123', role: 'student'};
const data = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {'Content-Type': 'application/json', 'Content-Length': data.length}
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => {
    if (res.statusCode === 201) {
      const result = JSON.parse(body);
      console.log('SUCCESS! Registration worked');
      console.log('User:', result.name);
      console.log('Email:', result.email);
      console.log('Role:', result.role);
      console.log('Token:', result.token.substring(0, 40) + '...');
    } else {
      console.log('Status:', res.statusCode);
      console.log('Error:', body);
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
