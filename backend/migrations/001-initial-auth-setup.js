/**
 * Initial Authentication Setup Migration
 * 
 * This migration script:
 * 1. Creates initial regions
 * 2. Creates administrator account
 * 3. Optionally assigns existing members to a default region
 * 
 * Usage:
 *   node migrations/001-initial-auth-setup.js
 */

require('dotenv').config();
const sequelize = require('../config/database');
const User = require('../models/User');
const Region = require('../models/Region');
const Member = require('../models/Member');

// Configuration: Edit these values before running
const ADMIN_CONFIG = {
  username: 'admin',
  password: 'Admin@123',  // IMPORTANT: Change this password after first login!
  fullName: 'System Administrator'
};

// Initial regions to create
const INITIAL_REGIONS = [
  { name: 'Krishnagiri', type: 'VILLAGE', description: 'Main village area' },
  { name: 'Kaveripattinam', type: 'TOWN', description: 'Town area' },
  { name: 'Hosur', type: 'TOWN', description: 'Hosur town area' },
  // Add more regions as needed
];

// Set to true to assign all existing members to a default region
const ASSIGN_EXISTING_MEMBERS = true;
const DEFAULT_REGION_NAME = 'Krishnagiri'; // Region to assign existing members to

async function runMigration() {
  console.log('='.repeat(60));
  console.log('Starting Initial Authentication Setup Migration');
  console.log('='.repeat(60));
  console.log('');

  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection successful');
    console.log('');

    // Step 1: Create regions
    console.log('Step 1: Creating initial regions...');
    console.log('-'.repeat(60));
    
    const createdRegions = [];
    for (const regionData of INITIAL_REGIONS) {
      try {
        const region = await Region.create(regionData);
        console.log(`✓ Created region: ${region.name} (${region.type})`);
        createdRegions.push(region);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.log(`⚠ Region already exists: ${regionData.name}`);
          const existingRegion = await Region.findOne({ where: { name: regionData.name } });
          createdRegions.push(existingRegion);
        } else {
          throw error;
        }
      }
    }
    console.log(`\n✓ Regions created/verified: ${createdRegions.length}`);
    console.log('');

    // Step 2: Create administrator account
    console.log('Step 2: Creating administrator account...');
    console.log('-'.repeat(60));
    
    try {
      const admin = await User.create({
        username: ADMIN_CONFIG.username,
        password: ADMIN_CONFIG.password,
        fullName: ADMIN_CONFIG.fullName,
        role: 'ADMINISTRATOR',
        isActive: true
      });
      console.log(`✓ Administrator created successfully`);
      console.log(`  Username: ${admin.username}`);
      console.log(`  Password: ${ADMIN_CONFIG.password}`);
      console.log(`  \n⚠ IMPORTANT: Change this password after first login!`);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        console.log(`⚠ Administrator account already exists: ${ADMIN_CONFIG.username}`);
        console.log(`  Use existing credentials to login`);
      } else {
        throw error;
      }
    }
    console.log('');

    // Step 3: Optionally assign existing members to default region
    if (ASSIGN_EXISTING_MEMBERS) {
      console.log('Step 3: Assigning existing members to default region...');
      console.log('-'.repeat(60));
      
      const defaultRegion = await Region.findOne({ where: { name: DEFAULT_REGION_NAME } });
      
      if (!defaultRegion) {
        console.log(`⚠ Default region "${DEFAULT_REGION_NAME}" not found. Skipping member assignment.`);
      } else {
        // Find members without a region
        const unassignedMembers = await Member.count({ where: { regionId: null } });
        
        if (unassignedMembers === 0) {
          console.log('✓ No unassigned members found');
        } else {
          const [updatedCount] = await Member.update(
            { regionId: defaultRegion.id },
            { where: { regionId: null } }
          );
          console.log(`✓ Assigned ${updatedCount} existing members to region: ${defaultRegion.name}`);
        }
      }
      console.log('');
    } else {
      console.log('Step 3: Skipping assignment of existing members (disabled)');
      console.log('');
    }

    // Summary
    console.log('='.repeat(60));
    console.log('Migration Completed Successfully!');
    console.log('='.repeat(60));
    console.log('\nNext Steps:');
    console.log('1. Login with administrator credentials:');
    console.log(`   Username: ${ADMIN_CONFIG.username}`);
    console.log(`   Password: ${ADMIN_CONFIG.password}`);
    console.log('2. Change the administrator password immediately');
    console.log('3. Create field worker accounts via the admin panel');
    console.log('4. Assign regions to field workers');
    console.log('');

    return {
      success: true,
      regions: createdRegions.length,
      message: 'Migration completed successfully'
    };

  } catch (error) {
    console.error('');
    console.error('='.repeat(60));
    console.error('Migration Failed!');
    console.error('='.repeat(60));
    console.error('Error:', error.message);
    console.error('');
    console.error('Details:', error);
    
    return {
      success: false,
      error: error.message
    };
  } finally {
    await sequelize.close();
    console.log('Database connection closed');
  }
}

// Run migration if executed directly
if (require.main === module) {
  runMigration()
    .then((result) => {
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = runMigration;
