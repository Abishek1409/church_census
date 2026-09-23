// Create field worker accounts for existing regions that don't have them
const axios = require('axios');

const API_URL = 'https://church-census.onrender.com';

const MISSING_ACCOUNTS = [
  { regionName: 'Krishnagiri', username: 'Krishnagiri', password: 'Krishnagiri@123' },
  { regionName: 'Hosur', username: 'Hosur', password: 'Hosur@123' },
  { regionName: 'Kaveripattinam', username: 'Kaveripattinam', password: 'Kaveripattinam@123' }
];

async function createMissingFieldWorkers() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('    CREATING MISSING FIELD WORKER ACCOUNTS');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // Login as admin
    console.log('Step 1: Login as administrator...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      username: 'admin',
      password: 'Admin@123'
    });
    const adminToken = loginResponse.data.data.token;
    console.log('✓ Logged in as administrator\n');

    // Get all regions
    console.log('Step 2: Fetching regions...');
    const regionsResponse = await axios.get(`${API_URL}/api/regions`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const regions = regionsResponse.data.data;
    console.log(`✓ Found ${regions.length} regions\n`);

    // Get all users
    console.log('Step 3: Fetching existing users...');
    const usersResponse = await axios.get(`${API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const existingUsernames = usersResponse.data.data.map(u => u.username);
    console.log(`✓ Found ${existingUsernames.length} existing users\n`);

    // Create missing field workers
    console.log('Step 4: Creating missing field worker accounts...');
    console.log('─────────────────────────────────────────────────────────\n');

    for (const account of MISSING_ACCOUNTS) {
      try {
        // Check if user already exists
        if (existingUsernames.includes(account.username)) {
          console.log(`⚠️  User "${account.username}" already exists - skipping`);
          continue;
        }

        // Find the region
        const region = regions.find(r => r.name === account.regionName);
        if (!region) {
          console.log(`❌ Region "${account.regionName}" not found - skipping`);
          continue;
        }

        // Create the user
        const createUserResponse = await axios.post(`${API_URL}/api/users`, {
          username: account.username,
          password: account.password,
          fullName: `${account.regionName} Field Worker`,
          role: 'FIELD_WORKER'
        }, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });

        if (createUserResponse.data.success) {
          const userId = createUserResponse.data.data.id;
          console.log(`✓ Created user: ${account.username}`);

          // Assign region to user
          try {
            await axios.post(`${API_URL}/api/users/${userId}/regions`, {
              regionId: region.id
            }, {
              headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log(`✓ Assigned region "${region.name}" to user "${account.username}"`);
          } catch (assignError) {
            console.log(`⚠️  Warning: Could not assign region automatically`);
            console.log(`   User created successfully, but region assignment may need manual setup`);
          }

          console.log(`  Username: ${account.username}`);
          console.log(`  Password: ${account.password}`);
          console.log('');
        }
      } catch (error) {
        console.log(`❌ Failed to create "${account.username}": ${error.response?.data?.error?.message || error.message}`);
      }
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('    VERIFICATION');
    console.log('═══════════════════════════════════════════════════════\n');

    // Test each account
    for (const account of MISSING_ACCOUNTS) {
      try {
        const testLogin = await axios.post(`${API_URL}/api/auth/login`, {
          username: account.username,
          password: account.password
        });
        if (testLogin.data.success) {
          console.log(`✅ ${account.username} - Login works!`);
        }
      } catch (error) {
        console.log(`❌ ${account.username} - Login failed`);
      }
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('COMPLETE!');
    console.log('═══════════════════════════════════════════════════════');

  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
  }
}

createMissingFieldWorkers();
