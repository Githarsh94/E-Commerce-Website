const { Sequelize } = require('sequelize');
const sequelize = require('../database/config');

// Import models
const User = require('./user');
const Product = require('./product');
const Category = require('./category');
const Order = require('./order');
const OrderItem = require('./orderItem');
const Review = require('./review');
const Payment = require('./payment');
const Shipment = require('./shipment');
const ProductCategory = require('./productCategory');
const Cart = require('./cart');
const Wishlist = require('./wishlist');

// Define relationships
Product.belongsTo(Category, { foreignKey: { allowNull: true }, onDelete: 'SET NULL' });
Category.hasMany(Product);
Order.belongsTo(User);
User.hasMany(Order);
OrderItem.belongsTo(Order);
Order.hasMany(OrderItem);
OrderItem.belongsTo(Product);
Product.hasMany(OrderItem);
Review.belongsTo(Product, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });
Product.hasMany(Review);
Review.belongsTo(User);
User.hasMany(Review);

User.hasMany(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Cart, { foreignKey: 'productId', onDelete: 'CASCADE' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Wishlist, { foreignKey: 'userId', onDelete: 'CASCADE' });
Wishlist.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Wishlist, { foreignKey: 'productId', onDelete: 'CASCADE' });
Wishlist.belongsTo(Product, { foreignKey: 'productId' });

const syncDB = async () => {
  await sequelize.sync({ alter: true });
  console.log('Database synchronized');
};

module.exports = { sequelize, User, Product, Category, Order, OrderItem, Review, Payment, Shipment, ProductCategory, Cart, Wishlist, syncDB };
