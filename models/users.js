const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import the sequelize instance from db.js

const User = sequelize.define('User', {
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
    required: [true, 'First name is required'],
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
    required: [true, 'Last name is required'],
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    required: [true, 'Email is required'],
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    required: [true, 'Password is required'],
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

module.exports = User;