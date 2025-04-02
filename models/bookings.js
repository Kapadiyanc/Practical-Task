const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./users');

const Booking = sequelize.define('Booking', {
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false,
    required: [true, 'Customer name is required'],
  },
  customer_email: {
    type: DataTypes.STRING,
    allowNull: false,
    required: [true, 'Customer email is required'],
  },
  booking_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    required: [true, 'Booking date is required'],
  },
  booking_type: {
    type: DataTypes.ENUM('Full Day', 'Half Day', 'Custom'),
    allowNull: false,
    required: [true, 'Booking type is required'],
  },
  booking_slot: {
    type: DataTypes.ENUM('First Half', 'Second Half'),
    allowNull: true,
    required: function () { return this.booking_type === 'Half Day'; }, // Only required if a booking type equals 'Half Day'
  },
  booking_time: {
    type: DataTypes.TIME,
    allowNull: true,
    required: [true, 'Booking time is required'],
  },
}, {
  timestamps: true,
});

// Establish the relationship: A user can have many bookings
User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Booking;