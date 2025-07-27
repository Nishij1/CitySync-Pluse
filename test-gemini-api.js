// Simple test script to verify Gemini API integration
// Run with: node test-gemini-api.js

const API_KEY = 'AIzaSyCGT4aHNlF-FHheuhh2EG-cnSrg4MhDq9s';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

async function testGeminiAPI() {
  console.log('Testing Gemini 2.0 Flash API...');
  
  try {
    const response = await fetch(`${BASE_URL}/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello! This is a test message for CitySync+ chatbot. Please respond with a brief greeting.'
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API Response received successfully!');
    console.log('Response:', data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response text found');
    
    return true;
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
    return false;
  }
}

// Run the test
testGeminiAPI().then(success => {
  if (success) {
    console.log('\n🎉 Gemini API integration is working correctly!');
  } else {
    console.log('\n💥 Gemini API integration needs attention.');
  }
});
