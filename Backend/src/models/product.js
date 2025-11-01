const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  numRatings: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  numReviews: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Allow NULL values to resolve the conflict
  },
}, {
  timestamps: true,
});

module.exports = Product;
