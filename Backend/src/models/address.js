const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");

const Address = sequelize.define("address", {
  street: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  zipCode: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Address;
