const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");

const Payment = sequelize.define("payment", {
  method: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM("pending", "completed", "failed"), defaultValue: "pending" },
});

module.exports = Payment;
