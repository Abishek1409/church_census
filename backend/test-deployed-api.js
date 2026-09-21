/**
 * Test script for deployed API on Render.com
 * 
 * Usage:
 *   node test-deployed-api.js https://your-app-name.onrender.com
 * 
 * Tests all endpoints to verify deployment is working correctly
 */

const https = require('https');

// Get API URL from command line argument
const API_URL = process.argv[2];

if (!API_URL) {
  console.error('❌ Error: Please provide your Render.com API URL');
  console.log('\nUsage:');
  console.log('  node test-deployed-api.js https://your-app-name.onrender.com');
  process.exit(1);
}

console.log('🧪 Testing Deployed API...');
console.log(`📍 API URL: ${API_URL}\n`);

// Helper function to make HTTP requests
function makeRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}${endpoint}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Test suite
async function runTests() {
  const tests = [
    {
      name: 'Root endpoint',
      endpoint: '/',
      expected: 200
    },
    {
      name: 'Health check',
      endpoint: '/api/health',
      expected: 200
    },
    {
      name: 'Get all members',
      endpoint: '/api/members',
      expected: 200
    },
    {
      name: 'Get statistics',
      endpoint: '/api/stats',
      expected: 200
    }
  ];

  console.log('Running tests...\n');
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await makeRequest(test.endpoint);
      
      if (result.status === test.expected) {
        console.log(`✅ ${test.name}`);
        console.log(`   Status: ${result.status}`);
        console.log(`   Response: ${JSON.stringify(result.data).substring(0, 100)}...`);
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
        console.log(`   Expected: ${test.expected}, Got: ${result.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
    console.log('');
  }

  // Summary
  console.log('═══════════════════════════════════════');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('═══════════════════════════════════════\n');

  if (failed === 0) {
    console.log('🎉 All tests passed! Your API is working correctly.');
    console.log(`\n📱 Use this URL in your mobile app: ${API_URL}`);
  } else {
    console.log('⚠️  Some tests failed. Check the following:');
    console.log('   1. Is your service "Live" in Render dashboard?');
    console.log('   2. Are environment variables set correctly?');
    console.log('   3. Check logs in Render dashboard for errors');
  }
}

// Run tests
runTests().catch((error) => {
  console.error('❌ Test suite failed:', error.message);
  process.exit(1);
});
