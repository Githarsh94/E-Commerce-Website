const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize("ecomm", "root", process.env.SQL_PASSWORD, {
  host: "localhost",
  dialect: "mysql",
  logging: (msg) => {
    // if (msg.startsWith('Executing (default): ALTER') || msg.startsWith('Executing (default): INSERT') || msg.startsWith('Executing (default): UPDATE') || msg.startsWith('Executing (default): DELETE')) {
    //   console.log(msg); // Only log when changes are made
    // }
  }
});

module.exports = sequelize;
