const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");

const Product = sequelize.define("product", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.FLOAT, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Product;
