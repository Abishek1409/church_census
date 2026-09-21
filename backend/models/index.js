const sequelize = require('../config/database');

// Import models
const Member = require('./Member');

const db = {
  sequelize,
  Sequelize: require('sequelize')
};

// Add models to db object
db.Member = Member;

module.exports = db;
