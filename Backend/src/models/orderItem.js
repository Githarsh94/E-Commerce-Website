const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");

const OrderItem = sequelize.define("order_item", {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
});

module.exports = OrderItem;
