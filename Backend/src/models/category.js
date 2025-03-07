const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');

const Category = sequelize.define('categories', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = Category;
