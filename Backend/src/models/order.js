const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");

const Order = sequelize.define("order", {
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM("pending", "shipped", "delivered"), defaultValue: "pending" },

  // Snapshot of purchased products (array of { productId, quantity })
  products: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue("products");
      if (value) {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
      return null;
    },
    set(value) {
      this.setDataValue("products", JSON.stringify(value));
    },
  },
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
