const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");

const Order = sequelize.define("order", {
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM("pending", "shipped", "delivered"), defaultValue: "pending" },
});

module.exports = Order;
