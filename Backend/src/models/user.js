const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");
const bcrypt = require("bcrypt");

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

// Hook to hash the password before saving the user
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

module.exports = User;
