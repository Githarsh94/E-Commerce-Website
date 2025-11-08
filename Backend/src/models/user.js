const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");

const User = sequelize.define("user", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("customer", "admin"), defaultValue: "customer" },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: JSON.stringify({
      street: "",
      city: "",
      state: "",
      zipCode: "",
    }),
    get() {
      const value = this.getDataValue("address");
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    },
    set(value) {
      this.setDataValue("address", JSON.stringify(value));
    },
  },
});

module.exports = User;
