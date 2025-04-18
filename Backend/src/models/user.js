const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");

const User = sequelize.define("user", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("customer", "admin"), defaultValue: "customer" },
  address: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    }
  }
});

module.exports = User;
