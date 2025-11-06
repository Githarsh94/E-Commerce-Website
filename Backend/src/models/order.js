const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");

const Order = sequelize.define("order", {
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  // Snapshot of purchased products (array of { productId, quantity })
  products: { type: DataTypes.JSON, allowNull: true },
  status: {
    type: DataTypes.ENUM(
      'processing',
      'shipped',
      'in transit',
      'out for delivery',
      'delivered',
      'cancelled'
    ),
    defaultValue: 'processing'
  },
});

module.exports = Order;
