const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");

const Review = sequelize.define("review", {
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT },
});

module.exports = Review;
