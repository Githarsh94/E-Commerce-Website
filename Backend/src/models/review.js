const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ProductId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Ensure it matches the foreign key constraint
  },
}, {
  timestamps: true,
});

module.exports = Review;
