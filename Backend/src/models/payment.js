const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");

// Minimal payment model: store orderId, amount, method and status
const Payment = sequelize.define("payment", {
  orderId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  method: {
    type: DataTypes.ENUM("debit card", "credit card", "UPI", "Cash on delivery"),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("Pending", "Processing", "Completed"),
    defaultValue: "Pending"
  }
});

module.exports = Payment;
