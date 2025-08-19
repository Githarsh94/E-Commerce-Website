const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

// Simple hardcoded database config - only reads SQL_PASSWORD from .env
const sequelize = new Sequelize("ecommerce_db", "ecommerce_user", "ecommerce_password", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

module.exports = sequelize;
