const sequelize = require("../database/config");
const Category = require("./category");
const Product = require("./product");
const User = require("./user");
const Order = require("./order");
const OrderItem = require("./orderItem");
const Payment = require("./payment");
const ProductCategory = require("./productCategory");
const Review = require("./review");
const Shipment = require("./shipment");

const syncDB = async () => {
  await sequelize.sync({ alter: true });
  console.log("Database synchronized");
};

module.exports = { sequelize, syncDB };
