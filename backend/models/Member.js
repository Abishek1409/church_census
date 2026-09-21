const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Member = sequelize.define('Member', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Personal Information
  fullName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'full_name'
  },
  aadharNumber: {
    type: DataTypes.STRING(12),
    allowNull: false,
    unique: true,
    field: 'aadhar_number',
    validate: {
      is: /^[0-9]{12}$/,
      notNull: { msg: 'Aadhar number is required' },
      notEmpty: { msg: 'Aadhar number cannot be empty' }
    }
  },
  phoneNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'phone_number',
    validate: {
      is: /^[0-9]{10}$/,
      notNull: { msg: 'Phone number is required' },
      notEmpty: { msg: 'Phone number cannot be empty' }
    }
  },
  community: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notNull: { msg: 'Community is required' },
      notEmpty: { msg: 'Community cannot be empty' }
    }
  },
  subCaste: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'sub_caste',
    validate: {
      notNull: { msg: 'Sub-caste is required' },
      notEmpty: { msg: 'Sub-caste cannot be empty' }
    }
  },
  // Housing Information
  housingType: {
    type: DataTypes.ENUM('Rent', 'Owned', 'Government Provided'),
    allowNull: false,
    field: 'housing_type',
    validate: {
      notNull: { msg: 'Housing type is required' },
      isIn: {
        args: [['Rent', 'Owned', 'Government Provided']],
        msg: 'Housing type must be Rent, Owned, or Government Provided'
      }
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: { msg: 'Address is required' },
      notEmpty: { msg: 'Address cannot be empty' }
    }
  },
  hasPatta: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: 'has_patta',
    defaultValue: null
  },
  // Occupation and Financial
  occupation: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: 'Occupation is required' },
      notEmpty: { msg: 'Occupation cannot be empty' }
    }
  },
  income: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notNull: { msg: 'Income is required' },
      min: {
        args: [0],
        msg: 'Income must be a positive number'
      }
    }
  },
  // Education
  educationQualification: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'education_qualification',
    validate: {
      notNull: { msg: 'Education qualification is required' },
      notEmpty: { msg: 'Education qualification cannot be empty' }
    }
  },
  // Government Documentation
  rationCardNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'ration_card_number',
    validate: {
      notNull: { msg: 'Ration card number is required' },
      notEmpty: { msg: 'Ration card number cannot be empty' }
    }
  }
}, {
  tableName: 'members',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_members_name',
      fields: ['full_name']
    },
    {
      name: 'idx_members_community',
      fields: ['community']
    },
    {
      name: 'idx_members_aadhar',
      unique: true,
      fields: ['aadhar_number']
    }
  ]
});

module.exports = Member;
