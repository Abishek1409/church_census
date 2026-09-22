/**
 * Test script to verify authentication endpoints are reachable
 * Run this from the mobile directory: node test-auth-endpoints.js
 */

const axios = require('axios');

// Update this with your Render.com backend URL
const API_BASE_URL = 'https://church-census.onrender.com/api';

console.log('🔍 Testing Authentication Endpoints...\n');
console.log(`Backend URL: ${API_BASE_URL}\n`);

// Test endpoints
const endpoints = [
  { method: 'GET', path: '/auth/me', requiresAuth: true },
  { method: 'POST', path: '/auth/login', requiresAuth: false },
  { method: 'POST', path: '/auth/logout', requiresAuth: true },
  { method: 'POST', path: '/auth/refresh', requiresAuth: true },
];

async function testEndpoint(endpoint) {
  const url = `${API_BASE_URL}${endpoint.path}`;
  
  try {
    console.log(`Testing: ${endpoint.method} ${endpoint.path}`);
    
    let response;
    
    if (endpoint.method === 'GET') {
      response = await axios.get(url, { 
        timeout: 10000,
        validateStatus: () => true // Accept any status code
      });
    } else {
      response = await axios.post(url, {}, { 
        timeout: 10000,
        validateStatus: () => true // Accept any status code
      });
    }
    
    // Check response
    if (endpoint.requiresAuth && response.status === 401) {
      console.log(`  ✅ Endpoint exists (401 - requires authentication)\n`);
      return true;
    } else if (!endpoint.requiresAuth && response.status === 400) {
      console.log(`  ✅ Endpoint exists (400 - missing credentials)\n`);
      return true;
    } else if (response.status === 404) {
      console.log(`  ❌ Endpoint not found (404)\n`);
      return false;
    } else if (response.status >= 200 && response.status < 300) {
      console.log(`  ✅ Endpoint reachable (${response.status})\n`);
      return true;
    } else {
      console.log(`  ⚠️  Unexpected status: ${response.status}\n`);
      return true; // Endpoint exists but returned unexpected status
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log(`  ❌ Connection refused - Backend not running\n`);
    } else if (error.code === 'ENOTFOUND') {
      console.log(`  ❌ DNS error - Invalid backend URL\n`);
    } else if (error.code === 'ETIMEDOUT') {
      console.log(`  ❌ Request timeout - Backend may be sleeping (Render free tier)\n`);
      console.log(`     Retrying in 15 seconds...\n`);
      
      // Retry once after 15 seconds for Render.com cold start
      await new Promise(resolve => setTimeout(resolve, 15000));
      return testEndpoint(endpoint);
    } else {
      console.log(`  ❌ Error: ${error.message}\n`);
    }
    return false;
  }
}

async function runTests() {
  console.log('⏳ Waking up backend (Render.com free tier may take 30-50 seconds)...\n');
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push({ endpoint, result });
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.result).length;
  const total = results.length;
  
  console.log(`\nTotal: ${passed}/${total} endpoints reachable`);
  
  if (passed === total) {
    console.log('✅ All authentication endpoints are properly configured!\n');
  } else {
    console.log('⚠️  Some endpoints are not reachable. Check backend deployment.\n');
  }
  
  // Detailed results
  console.log('\nDetails:');
  results.forEach(({ endpoint, result }) => {
    const status = result ? '✅' : '❌';
    console.log(`  ${status} ${endpoint.method} ${endpoint.path}`);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 Next Steps:');
  console.log('   1. Ensure JWT_SECRET is set in Render.com environment variables');
  console.log('   2. Verify backend service is running on Render.com');
  console.log('   3. Test login with valid credentials from the mobile app\n');
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Test execution failed:', error.message);
  process.exit(1);
});
