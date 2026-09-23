const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserRegion = sequelize.define('UserRegion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  regionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'region_id',
    references: {
      model: 'regions',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  assignedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'assigned_at'
  },
  assignedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'assigned_by',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'user_regions',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      name: 'idx_user_regions_user',
      fields: ['user_id']
    },
    {
      name: 'idx_user_regions_region',
      fields: ['region_id']
    },
    {
      name: 'idx_user_regions_unique',
      unique: true,
      fields: ['user_id', 'region_id']
    }
  ]
});

module.exports = UserRegion;
