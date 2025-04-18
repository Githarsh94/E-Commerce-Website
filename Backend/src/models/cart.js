const { DataTypes } = require('sequelize');
const sequelize = require('../database/config'); // Linked Sequelize config

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
}, {
    timestamps: true,
});

module.exports = Cart;
