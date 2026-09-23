const sequelize = require('../config/database');

// Import models
const Member = require('./Member');
const User = require('./User');
const Region = require('./Region');
const UserRegion = require('./UserRegion');

const db = {
  sequelize,
  Sequelize: require('sequelize')
};

// Add models to db object
db.Member = Member;
db.User = User;
db.Region = Region;
db.UserRegion = UserRegion;

// Define associations
// User <-> Region (Many-to-Many through UserRegion)
User.belongsToMany(Region, {
  through: UserRegion,
  foreignKey: 'userId',
  otherKey: 'regionId',
  as: 'assignedRegions'
});

Region.belongsToMany(User, {
  through: UserRegion,
  foreignKey: 'regionId',
  otherKey: 'userId',
  as: 'assignedUsers'
});

// Region -> Member (One-to-Many)
Region.hasMany(Member, {
  foreignKey: 'regionId',
  as: 'members'
});

Member.belongsTo(Region, {
  foreignKey: 'regionId',
  as: 'region'
});

// UserRegion associations for direct queries
UserRegion.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

UserRegion.belongsTo(Region, {
  foreignKey: 'regionId',
  as: 'region'
});

UserRegion.belongsTo(User, {
  foreignKey: 'assignedBy',
  as: 'assignedByUser'
});

module.exports = db;
