const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");

const ProductCategory = sequelize.define("product_category", {});

module.exports = ProductCategory;
