const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');

const Address = sequelize.define('address', {
  name: { type: DataTypes.STRING, allowNull: false },
  // Primary mobile number for the address (10-digit expected)
  mobileNo: { type: DataTypes.STRING, allowNull: false },
  // Optional alternate/landline number
  phone: { type: DataTypes.STRING, allowNull: true },
  alternatePhone: { type: DataTypes.STRING, allowNull: true },
  pincode: { type: DataTypes.STRING, allowNull: false },
  locality: { type: DataTypes.STRING, allowNull: true },
  addressLine: { type: DataTypes.TEXT, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  landmark: { type: DataTypes.STRING, allowNull: true },
  addressType: { type: DataTypes.ENUM('home', 'work'), allowNull: false, defaultValue: 'home' },
  isDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
});

module.exports = Address;
