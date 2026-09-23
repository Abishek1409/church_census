/**
 * Production Setup Script
 * Creates regions and their corresponding field worker accounts
 * 
 * Usage: node backend/setup-production-accounts.js
 */

require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.DEPLOYED_API_URL || 'https://church-census.onrender.com';

// Define regions to create with their field worker accounts
const REGIONS_TO_CREATE = [
  {
    name: 'Krishnagiri',
    type: 'TOWN',
    description: 'Krishnagiri Town Area'
  },
  {
    name: 'Hosur',
    type: 'TOWN',
    description: 'Hosur Town Area'
  },
  {
    name: 'Dharmapuri',
    type: 'TOWN',
    description: 'Dharmapuri Town Area'
  },
  {
    name: 'Kaveripattinam',
    type: 'VILLAGE',
    description: 'Kaveripattinam Village Area'
  },
  {
    name: 'Denkanikottai',
    type: 'TOWN',
    description: 'Denkanikottai Town Area'
  },
  {
    name: 'Pochampalli',
    type: 'VILLAGE',
    description: 'Pochampalli Village Area'
  }
];

async function setupProductionAccounts() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('    PRODUCTION ACCOUNT SETUP');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log(`API URL: ${API_URL}`);
  console.log('');

  try {
    // Step 1: Login as administrator
    console.log('Step 1: Logging in as administrator...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      username: 'admin',
      password: 'Admin@123'
    });

    const adminToken = loginResponse.data.data.token;
    console.log('✓ Administrator logged in successfully\n');

    // Step 2: Get existing regions
    console.log('Step 2: Checking existing regions...');
    const existingRegionsResponse = await axios.get(`${API_URL}/api/regions`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const existingRegionNames = existingRegionsResponse.data.data.map(r => r.name);
    console.log(`✓ Found ${existingRegionNames.length} existing regions: ${existingRegionNames.join(', ')}\n`);

    // Step 3: Create regions and field workers
    console.log('Step 3: Creating regions and field worker accounts...');
    console.log('─────────────────────────────────────────────────────────\n');

    const createdAccounts = [];

    for (const regionData of REGIONS_TO_CREATE) {
      try {
        // Check if region already exists
        if (existingRegionNames.includes(regionData.name)) {
          console.log(`⚠️  Region "${regionData.name}" already exists - skipping`);
          createdAccounts.push({
            region: regionData.name,
            username: regionData.name,
            password: `${regionData.name}@123`,
            status: 'Already exists'
          });
          continue;
        }

        // Create region (which auto-creates field worker)
        const createResponse = await axios.post(`${API_URL}/api/regions`, regionData, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });

        if (createResponse.data.success) {
          const fieldWorker = createResponse.data.data.fieldWorker;
          console.log(`✓ Created region: ${regionData.name}`);
          console.log(`  Field Worker Username: ${fieldWorker.username}`);
          console.log(`  Field Worker Password: ${fieldWorker.temporaryPassword}`);
          console.log('');

          createdAccounts.push({
            region: regionData.name,
            username: fieldWorker.username,
            password: fieldWorker.temporaryPassword,
            status: 'Created'
          });
        }
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`⚠️  Region "${regionData.name}" already exists - skipping`);
          createdAccounts.push({
            region: regionData.name,
            username: regionData.name,
            password: `${regionData.name}@123`,
            status: 'Already exists'
          });
        } else {
          console.error(`✗ Failed to create region "${regionData.name}":`, error.response?.data?.error?.message || error.message);
        }
      }
    }

    // Step 4: Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('    SETUP COMPLETE - PRODUCTION ACCOUNTS');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('ADMINISTRATOR ACCOUNT:');
    console.log('─────────────────────────────────────────────────────────');
    console.log('Username: admin');
    console.log('Password: Admin@123');
    console.log('Role:     ADMINISTRATOR (access to all regions)');
    console.log('');
    console.log('FIELD WORKER ACCOUNTS (Region-Specific):');
    console.log('─────────────────────────────────────────────────────────');
    
    createdAccounts.forEach((account, index) => {
      console.log(`${index + 1}. ${account.region} (${account.status})`);
      console.log(`   Username: ${account.username}`);
      console.log(`   Password: ${account.password}`);
      console.log('');
    });

    console.log('═══════════════════════════════════════════════════════');
    console.log('NOTES:');
    console.log('- Each field worker can only see and manage members in their assigned region');
    console.log('- Administrator can see and manage all regions and members');
    console.log('- Field worker accounts are auto-created when regions are created');
    console.log('- Password format: <RegionName>@123');
    console.log('');
    console.log('⚠️  IMPORTANT: Change passwords after first login in production!');
    console.log('═══════════════════════════════════════════════════════');

    return {
      success: true,
      accountsCreated: createdAccounts.length
    };

  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════');
    console.error('    SETUP FAILED');
    console.error('═══════════════════════════════════════════════════════');
    console.error('Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.error('');
      console.error('Administrator credentials are incorrect.');
      console.error('Please verify admin username and password.');
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Run setup if executed directly
if (require.main === module) {
  setupProductionAccounts()
    .then((result) => {
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = setupProductionAccounts;
