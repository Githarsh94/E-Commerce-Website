const { DataTypes } = require('sequelize');
const sequelize = require('../database/config'); // Linked Sequelize config

const Wishlist = sequelize.define('Wishlist', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
}, {
    timestamps: true,
});

module.exports = Wishlist;
