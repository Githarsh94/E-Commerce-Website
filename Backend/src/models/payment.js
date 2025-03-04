const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");
const User = require("./user");
const Order = require("./order");


const Payment = sequelize.define("payment", {
  method: { 
    type: DataTypes.ENUM("debit card", "credit card", "UPI", "Cash on delivery"), 
    allowNull: false 
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: 'id'
    }
  }
});

module.exports = Payment;
