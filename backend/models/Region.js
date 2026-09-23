const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Region = sequelize.define('Region', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'Region name is required' },
      notEmpty: { msg: 'Region name cannot be empty' }
    }
  },
  type: {
    type: DataTypes.ENUM('VILLAGE', 'TOWN', 'DISTRICT'),
    allowNull: false,
    validate: {
      notNull: { msg: 'Region type is required' },
      isIn: {
        args: [['VILLAGE', 'TOWN', 'DISTRICT']],
        msg: 'Region type must be VILLAGE, TOWN, or DISTRICT'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'regions',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_regions_name',
      unique: true,
      fields: ['name']
    }
  ]
});

module.exports = Region;
