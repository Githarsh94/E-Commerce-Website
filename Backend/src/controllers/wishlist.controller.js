const Wishlist = require('../models/wishlist');

exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const wishlistItem = await Wishlist.create({ userId: req.user.id, productId });
        res.status(201).json(wishlistItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getWishlist = async (req, res) => {
    try {
        const wishlistItems = await Wishlist.findAll({ where: { userId: req.user.id } });
        res.status(200).json(wishlistItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const wishlistItem = await Wishlist.findByPk(id);
        if (!wishlistItem || wishlistItem.userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        await wishlistItem.destroy();
        res.status(200).json({ message: 'Item removed from wishlist' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
