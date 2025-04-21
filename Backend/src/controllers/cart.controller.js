const Cart = require('../models/cart');
const Product = require('../models/product');

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findByPk(productId);
        if (!product) return res.status(400).json({ error: 'Invalid productId' });
        if (quantity <= 0) return res.status(400).json({ error: 'Quantity must be greater than 0' });
        if (quantity > product.stock) return res.status(400).json({ error: 'Insufficient stock' });
        const existingCartItem = await Cart.findOne({ where: { userId: req.user.id, productId } });
        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            return res.status(200).json(existingCartItem);
        }
        const cartItem = await Cart.create({ userId: req.user.id, productId, quantity });
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cartItems = await Cart.findAll({ where: { userId: req.user.id } });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const cartItem = await Cart.findByPk(id);
        if (!cartItem) {
            return res.status(403).json({ error: 'Item not found' });
        }
        // if (cartItem.userId !== req.user.id) {
        //     return res.status(403).json({ error: 'Unauthorized' });
        // }
        await cartItem.destroy();
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.decreaseQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const cartItem = await Cart.findByPk(id);
        if (!cartItem) {
            return res.status(403).json({ error: 'Item not found' });
        }
        if (cartItem.quantity <= 1) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' });
        }
        cartItem.quantity -= 1;
        await cartItem.save();
        res.status(200).json(cartItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.increaseQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const cartItem = await Cart.findByPk(id);
        if (!cartItem) {
            return res.status(403).json({ error: 'Item not found' });
        }
        const product = await Product.findByPk(cartItem.productId);
        if (!product) {
            return res.status(403).json({ error: 'Product not found' });
        }
        if (cartItem.quantity >= product.stock) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }
        cartItem.quantity += 1;
        await cartItem.save();
        res.status(200).json(cartItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}