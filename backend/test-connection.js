require('dotenv').config();
const db = require('./models');

const testConnection = async () => {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden for security)' : 'NOT SET');
    
    // Test connection
    await db.sequelize.authenticate();
    console.log('✓ Database connection successful!');
    
    // Test model sync
    await db.sequelize.sync({ alter: true });
    console.log('✓ Database models synchronized!');
    
    // Display table info
    console.log('\nDatabase Tables:');
    const tables = await db.sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
      { type: db.sequelize.QueryTypes.SELECT }
    );
    tables.forEach(table => console.log(`  - ${table.table_name}`));
    
    // Test creating a sample member (optional)
    console.log('\nTesting Member model...');
    const testMember = {
      fullName: 'Test User',
      aadharNumber: '123456789012',
      phoneNumber: '9876543210',
      community: 'Catholic',
      subCaste: 'Latin',
      housingType: 'Owned',
      address: '123 Test Street, Test City',
      hasPatta: true,
      occupation: 'Engineer',
      income: 50000.00,
      educationQualification: 'Bachelor of Engineering',
      rationCardNumber: 'RC123456'
    };
    
    const member = await db.Member.create(testMember);
    console.log('✓ Test member created with ID:', member.id);
    
    // Clean up test member
    await member.destroy();
    console.log('✓ Test member deleted');
    
    console.log('\n✓ All database tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database test failed:', error.message);
    if (error.parent) {
      console.error('  Details:', error.parent.message);
    }
    process.exit(1);
  }
};

testConnection();
