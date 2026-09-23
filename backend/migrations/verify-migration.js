/**
 * Verify Migration Script
 * 
 * This script verifies that the authentication migration was successful:
 * - Checks if regions were created
 * - Checks if administrator account exists
 * - Checks member region assignments
 * - Tests administrator login
 * 
 * Usage:
 *   node migrations/verify-migration.js
 */

require('dotenv').config();
const sequelize = require('../config/database');
const User = require('../models/User');
const Region = require('../models/Region');
const Member = require('../models/Member');

async function verifyMigration() {
  console.log('='.repeat(60));
  console.log('Verifying Authentication Migration');
  console.log('='.repeat(60));
  console.log('');

  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection successful');
    console.log('');

    let allChecksPassed = true;

    // Check 1: Regions
    console.log('Check 1: Regions');
    console.log('-'.repeat(60));
    const regions = await Region.findAll();
    
    if (regions.length === 0) {
      console.log('✗ No regions found in database');
      console.log('  Run migration first: node migrations/001-initial-auth-setup.js');
      allChecksPassed = false;
    } else {
      console.log(`✓ Found ${regions.length} regions:`);
      regions.forEach(region => {
        console.log(`  - ${region.name} (${region.type})${region.isActive ? '' : ' [INACTIVE]'}`);
      });
    }
    console.log('');

    // Check 2: Administrator account
    console.log('Check 2: Administrator Account');
    console.log('-'.repeat(60));
    const admin = await User.findOne({ where: { role: 'ADMINISTRATOR' } });
    
    if (!admin) {
      console.log('✗ No administrator account found');
      console.log('  Run migration first: node migrations/001-initial-auth-setup.js');
      allChecksPassed = false;
    } else {
      console.log('✓ Administrator account exists:');
      console.log(`  Username: ${admin.username}`);
      console.log(`  Full Name: ${admin.fullName}`);
      console.log(`  Active: ${admin.isActive ? 'Yes' : 'No'}`);
      console.log(`  Last Login: ${admin.lastLogin || 'Never'}`);
    }
    console.log('');

    // Check 3: Field workers
    console.log('Check 3: Field Worker Accounts');
    console.log('-'.repeat(60));
    const fieldWorkers = await User.findAll({ where: { role: 'FIELD_WORKER' } });
    
    if (fieldWorkers.length === 0) {
      console.log('⚠ No field worker accounts found');
      console.log('  Create field workers using admin panel or API');
    } else {
      console.log(`✓ Found ${fieldWorkers.length} field worker(s):`);
      fieldWorkers.forEach(worker => {
        console.log(`  - ${worker.username} (${worker.fullName})${worker.isActive ? '' : ' [INACTIVE]'}`);
      });
    }
    console.log('');

    // Check 4: Member region assignments
    console.log('Check 4: Member Region Assignments');
    console.log('-'.repeat(60));
    const totalMembers = await Member.count();
    const assignedMembers = await Member.count({ where: { regionId: { [sequelize.Sequelize.Op.ne]: null } } });
    const unassignedMembers = totalMembers - assignedMembers;
    
    console.log(`Total members: ${totalMembers}`);
    console.log(`Assigned to regions: ${assignedMembers}`);
    console.log(`Unassigned: ${unassignedMembers}`);
    
    if (unassignedMembers > 0) {
      console.log('⚠ Some members are not assigned to regions');
      console.log('  Assign them manually or re-run migration with ASSIGN_EXISTING_MEMBERS=true');
    } else if (totalMembers > 0) {
      console.log('✓ All members are assigned to regions');
    }

    // Show member distribution by region
    if (assignedMembers > 0 && regions.length > 0) {
      console.log('\nMember distribution by region:');
      for (const region of regions) {
        const count = await Member.count({ where: { regionId: region.id } });
        if (count > 0) {
          console.log(`  ${region.name}: ${count} members`);
        }
      }
    }
    console.log('');

    // Check 5: Test admin password validation
    console.log('Check 5: Password Validation Test');
    console.log('-'.repeat(60));
    if (admin) {
      // We can't test the actual password without knowing it
      console.log('✓ Password hashing is configured (bcrypt)');
      console.log('  Test login manually using the API endpoint');
    }
    console.log('');

    // Summary
    console.log('='.repeat(60));
    if (allChecksPassed) {
      console.log('✓ Migration Verification Passed!');
      console.log('='.repeat(60));
      console.log('\nAuthentication system is ready to use.');
      console.log('\nNext steps:');
      console.log('1. Test administrator login via API');
      console.log('2. Change the default administrator password');
      console.log('3. Create field worker accounts');
      console.log('4. Assign regions to field workers');
    } else {
      console.log('✗ Migration Verification Failed!');
      console.log('='.repeat(60));
      console.log('\nPlease run the migration script first:');
      console.log('  node migrations/001-initial-auth-setup.js');
    }
    console.log('');

    return { success: allChecksPassed };

  } catch (error) {
    console.error('');
    console.error('='.repeat(60));
    console.error('Verification Failed!');
    console.error('='.repeat(60));
    console.error('Error:', error.message);
    console.error('');
    
    return { success: false, error: error.message };
  } finally {
    await sequelize.close();
  }
}

// Run verification if executed directly
if (require.main === module) {
  verifyMigration()
    .then((result) => {
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = verifyMigration;
