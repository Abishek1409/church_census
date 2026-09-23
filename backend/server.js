const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Church Census API' });
});

// API Routes
const apiRoutes = require('./routes/members');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const regionRoutes = require('./routes/regions');

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/regions', regionRoutes);

console.log('✓ Routes registered: /api, /api/auth, /api/users, /api/regions');

// Database connection and sync
const startServer = async () => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    // Sync models with database (creates tables if they don\'t exist)
    await db.sequelize.sync({ alter: true });
    console.log('✓ Database models synchronized');

    // Start server FIRST to avoid Render timeout
    app.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
      
      // Run migration after server is up
      console.log('Running initial migration...');
      const runMigration = require('./migrations/001-initial-auth-setup');
      runMigration()
        .then(() => console.log('✓ Migration check completed'))
        .catch(err => console.error('Migration error:', err));
    });
  } catch (error) {
    console.error('✗ Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

startServer();

