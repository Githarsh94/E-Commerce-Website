const Wishlist = require('../models/wishlist');
const Product = require('../models/product');

exports.addToWishlist = async (req, res) => {
    try {
        let { productId } = req.body;

        // try to resolve product; if missing and frontend sent product details, create a minimal product row
        let product = null;
        if (productId) product = await Product.findByPk(productId);

        if (!product && req.body.product && typeof req.body.product === 'object') {
            const p = req.body.product;
            try {
                product = await Product.create({
                    name: p.name || `Product ${Date.now()}`,
                    description: p.description || null,
                    price: Number(p.price) || 0,
                    stock: Number(p.stock) || 999,
                    image_url: p.image_url || p.image || '',
                });
                productId = product.id;
            } catch (e) {
                // creating product failed; continue and validate below
            }
        }

        const pid = Number(productId || (product && product.id) || 0);
        if (!pid) return res.status(400).json({ error: 'Invalid productId' });

        // avoid duplicate wishlist rows for same user/product
        const existing = await Wishlist.findOne({ where: { userId: req.user.id, productId: pid } });
        if (existing) return res.status(200).json(existing);

        const wishlistItem = await Wishlist.create({ userId: req.user.id, productId: pid });
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
