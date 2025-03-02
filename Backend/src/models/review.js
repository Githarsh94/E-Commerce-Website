const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");
const User = require("./user"); // Assuming you have a User model defined

const Review = sequelize.define("review", {
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
});

module.exports = Review;
