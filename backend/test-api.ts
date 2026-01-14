import axios from 'axios';

async function testApi() {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'test@urbanflow.pl',
      password: 'Test123!'
    });
    console.log('Success:', response.data);
  } catch (err: any) {
    console.log('Error status:', err.response?.status);
    console.log('Error data:', err.response?.data);
    console.log('Full error:', err.message);
  }
}

testApi();
