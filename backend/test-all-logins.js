// Test all production login credentials
const axios = require('axios');

const API_URL = 'https://church-census.onrender.com';

const ACCOUNTS_TO_TEST = [
  { username: 'admin', password: 'Admin@123', role: 'ADMINISTRATOR' },
  { username: 'Krishnagiri', password: 'Krishnagiri@123', role: 'FIELD_WORKER' },
  { username: 'Hosur', password: 'Hosur@123', role: 'FIELD_WORKER' },
  { username: 'Dharmapuri', password: 'Dharmapuri@123', role: 'FIELD_WORKER' },
  { username: 'Kaveripattinam', password: 'Kaveripattinam@123', role: 'FIELD_WORKER' },
  { username: 'Denkanikottai', password: 'Denkanikottai@123', role: 'FIELD_WORKER' },
  { username: 'Pochampalli', password: 'Pochampalli@123', role: 'FIELD_WORKER' }
];

async function testAllLogins() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('    TESTING ALL PRODUCTION LOGIN CREDENTIALS');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log(`API URL: ${API_URL}\n`);

  const results = [];

  for (const account of ACCOUNTS_TO_TEST) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username: account.username,
        password: account.password
      });

      if (response.data.success) {
        console.log(`✅ ${account.username.padEnd(20)} - LOGIN SUCCESS`);
        results.push({ ...account, status: 'SUCCESS', actualRole: response.data.data.user.role });
      } else {
        console.log(`❌ ${account.username.padEnd(20)} - LOGIN FAILED (unexpected response)`);
        results.push({ ...account, status: 'FAILED', error: 'Unexpected response' });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(`❌ ${account.username.padEnd(20)} - INVALID CREDENTIALS`);
        results.push({ ...account, status: 'INVALID', error: 'Invalid credentials' });
      } else {
        console.log(`❌ ${account.username.padEnd(20)} - ERROR: ${error.message}`);
        results.push({ ...account, status: 'ERROR', error: error.message });
      }
    }
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('    SUMMARY');
  console.log('═══════════════════════════════════════════════════════\n');

  const successful = results.filter(r => r.status === 'SUCCESS');
  const failed = results.filter(r => r.status !== 'SUCCESS');

  console.log(`✅ Successful: ${successful.length}/${ACCOUNTS_TO_TEST.length}`);
  console.log(`❌ Failed: ${failed.length}/${ACCOUNTS_TO_TEST.length}\n`);

  if (failed.length > 0) {
    console.log('FAILED ACCOUNTS:');
    failed.forEach(account => {
      console.log(`  - ${account.username}: ${account.error || account.status}`);
    });
    console.log('');
    console.log('POSSIBLE CAUSES:');
    console.log('1. Account does not exist in database');
    console.log('2. Password is incorrect');
    console.log('3. Account was created but region assignment failed');
    console.log('4. Database sync issue');
    console.log('');
    console.log('SOLUTION:');
    console.log('Run: node backend/setup-production-accounts.js');
    console.log('This will create any missing accounts.');
  } else {
    console.log('🎉 All accounts are working correctly!');
  }

  console.log('\n═══════════════════════════════════════════════════════');
}

testAllLogins();
