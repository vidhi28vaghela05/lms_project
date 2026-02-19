async function register() {
  const url = 'http://localhost:3000/api/auth/register';
  const data = {
    name: 'Vidhi Test',
    email: 'vidhi' + Date.now() + '@example.com',
    password: 'password123',
    role: 'student'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log('Response:', result);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

register();
