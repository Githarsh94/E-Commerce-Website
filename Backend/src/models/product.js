const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");
const Category = require("./category"); // Assuming you have a Category model

const Product = sequelize.define("product", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.FLOAT, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id'
    }
  }
});

module.exports = Product;
