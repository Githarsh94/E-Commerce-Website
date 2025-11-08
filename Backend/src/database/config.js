const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();


// Simple hardcoded database config - only reads SQL_PASSWORD from .env
const sequelize = new Sequelize(process.env.SQL_DATABASE, process.env.SQL_USER, process.env.SQL_PASSWORD, {
  host: process.env.SQL_HOST ? process.env.SQL_HOST : "localhost", // Use "mysql" host in CI/CD environment
  port: 3306,
  dialect: "mysql",
  logging: false
});

module.exports = sequelize;
