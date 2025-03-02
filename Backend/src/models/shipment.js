const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");

const Shipment = sequelize.define("shipment", {
  trackingNumber: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM("in transit", "delivered"), defaultValue: "in transit" },
});

module.exports = Shipment;
