const { DataTypes } = require("sequelize");
const sequelize = require("../database/config");
const User = require("./user"); // Assuming you have a User model defined
const Product = require("./product"); // Assuming you have a Product model defined

const Review = sequelize.define("review", {
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    }
  }
});

module.exports = Review;
