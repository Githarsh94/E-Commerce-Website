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
const Address = require('./address');

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

// Address relationship: users can have multiple addresses
User.hasMany(Address, { foreignKey: 'userId', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'userId' });

const syncDB = async () => {
  // NOTE: switched to plain sync() to avoid Sequelize issuing ALTER TABLE
  // statements on startup. In some environments (development DBs that
  // accumulated many indexes) ALTERs can fail with "Too many keys"
  // (MySQL limit = 64). Using sync() will create missing tables but
  // won't attempt to alter existing columns/indexes.
  await sequelize.sync();
  console.log('Database synchronized (sync without alter)');

  // Note: schema modification checks (for addresses.mobileNo or product aggregates)
  // have been removed. Schema changes should be applied via migrations or run
  // manually by the DBA to avoid unexpected ALTERs at runtime.

  // Product aggregate columns (rating, numRatings, numReviews) are managed via migrations
};

module.exports = { sequelize, User, Product, Category, Order, OrderItem, Review, Payment, Shipment, ProductCategory, Cart, Wishlist, Address, syncDB };
