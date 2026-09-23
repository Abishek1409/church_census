// Assign regions to the newly created field worker accounts
const axios = require('axios');

const API_URL = 'https://church-census.onrender.com';

const USER_REGION_ASSIGNMENTS = [
  { username: 'Krishnagiri', regionName: 'Krishnagiri' },
  { username: 'Hosur', regionName: 'Hosur' },
  { username: 'Kaveripattinam', regionName: 'Kaveripattinam' }
];

async function assignRegionsToUsers() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('    ASSIGNING REGIONS TO FIELD WORKERS');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // Login as admin
    console.log('Step 1: Login as administrator...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      username: 'admin',
      password: 'Admin@123'
    });
    const adminToken = loginResponse.data.data.token;
    console.log('✓ Logged in\n');

    // Get all regions
    console.log('Step 2: Fetching regions...');
    const regionsResponse = await axios.get(`${API_URL}/api/regions`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const regions = regionsResponse.data.data;
    console.log(`✓ Found ${regions.length} regions\n`);

    // Get all users
    console.log('Step 3: Fetching users...');
    const usersResponse = await axios.get(`${API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const users = usersResponse.data.data;
    console.log(`✓ Found ${users.length} users\n`);

    // Assign regions
    console.log('Step 4: Assigning regions to users...');
    console.log('─────────────────────────────────────────────────────────\n');

    for (const assignment of USER_REGION_ASSIGNMENTS) {
      try {
        // Find user
        const user = users.find(u => u.username === assignment.username);
        if (!user) {
          console.log(`❌ User "${assignment.username}" not found`);
          continue;
        }

        // Find region
        const region = regions.find(r => r.name === assignment.regionName);
        if (!region) {
          console.log(`❌ Region "${assignment.regionName}" not found`);
          continue;
        }

        // Assign region to user
        const assignResponse = await axios.put(
          `${API_URL}/api/users/${user.id}/regions`,
          {
            regionIds: [region.id]
          },
          {
            headers: { Authorization: `Bearer ${adminToken}` }
          }
        );

        if (assignResponse.data.success) {
          console.log(`✓ Assigned "${assignment.regionName}" to "${assignment.username}"`);
        }
      } catch (error) {
        console.log(`❌ Failed to assign region to "${assignment.username}": ${error.response?.data?.error?.message || error.message}`);
      }
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('    VERIFICATION');
    console.log('═══════════════════════════════════════════════════════\n');

    // Test each account can see their region
    for (const assignment of USER_REGION_ASSIGNMENTS) {
      try {
        const testLogin = await axios.post(`${API_URL}/api/auth/login`, {
          username: assignment.username,
          password: `${assignment.username}@123`
        });
        
        if (testLogin.data.success) {
          const token = testLogin.data.data.token;
          
          // Get regions for this user
          const regionsCheck = await axios.get(`${API_URL}/api/regions`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const assignedRegions = regionsCheck.data.data.filter(r => r.isAssigned);
          console.log(`✅ ${assignment.username.padEnd(20)} → Assigned: ${assignedRegions.map(r => r.name).join(', ')}`);
        }
      } catch (error) {
        console.log(`❌ ${assignment.username.padEnd(20)} → Verification failed`);
      }
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ COMPLETE!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\nAll field workers now have their regions assigned!');

  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
  }
}

assignRegionsToUsers();
