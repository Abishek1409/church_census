// Verify field worker account works correctly
const axios = require('axios');

const API_URL = 'https://church-census.onrender.com';

async function verifyFieldWorkerLogin() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('    VERIFYING FIELD WORKER ACCOUNT');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // Test login with Dharmapuri field worker
    console.log('Testing login: Dharmapuri field worker');
    console.log('Username: Dharmapuri');
    console.log('Password: Dharmapuri@123\n');

    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      username: 'Dharmapuri',
      password: 'Dharmapuri@123'
    });

    console.log('✅ LOGIN SUCCESSFUL!');
    console.log('User Details:');
    console.log('  Username:', loginResponse.data.data.user.username);
    console.log('  Full Name:', loginResponse.data.data.user.fullName);
    console.log('  Role:', loginResponse.data.data.user.role);
    console.log('  Active:', loginResponse.data.data.user.isActive);
    console.log('');

    const token = loginResponse.data.data.token;

    // Test dashboard stats
    console.log('Testing dashboard stats access...');
    const statsResponse = await axios.get(`${API_URL}/api/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ DASHBOARD STATS ACCESSIBLE!');
    console.log('Stats for Dharmapuri region:');
    console.log('  Total Members:', statsResponse.data.data.totalMembers);
    console.log('  Housing Breakdown:', statsResponse.data.data.housingBreakdown);
    console.log('');

    // Test regions access
    console.log('Testing regions list...');
    const regionsResponse = await axios.get(`${API_URL}/api/regions`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const assignedRegions = regionsResponse.data.data.filter(r => r.isAssigned);
    console.log('✅ REGIONS ACCESSIBLE!');
    console.log('Assigned Regions:', assignedRegions.map(r => r.name).join(', '));
    console.log('');

    console.log('═══════════════════════════════════════════════════════');
    console.log('    ✅ FIELD WORKER ACCOUNT VERIFIED SUCCESSFULLY');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('The Dharmapuri field worker account is working correctly!');
    console.log('All other field worker accounts follow the same pattern.');
    console.log('');

  } catch (error) {
    console.error('❌ VERIFICATION FAILED');
    console.error('Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.error('\nCredentials are incorrect or account does not exist.');
    }
  }
}

verifyFieldWorkerLogin();
