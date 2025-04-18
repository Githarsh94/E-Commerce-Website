const Review = require('../models/review');
const Product = require('../models/product');

exports.addReview = async (req, res) => {
    try {
        const product = await Product.findByPk(req.body.productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const alreadyReviewed = await Review.findOne({ where: { userId: req.user.id, ProductId: req.body.productId } });
        if (alreadyReviewed) {
            return res.status(400).json({ error: 'You have already reviewed this product' });
        }
        const review = await Review.create({ userId: req.user.id, ProductId: req.body.productId, content: req.body.comment, rating: req.body.rating });
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getReviewsByProductId = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const reviews = await Review.findAll({ where: { productId: req.params.id } });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found' });
        if (review.userId !== req.user.id) return res.status(403).json({ error: 'You can only update your own reviews.' });

        const product = await Product.findByPk(req.body.productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await review.update(req.body);
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review || review.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
        if (review.userId !== req.user.id) return res.status(403).json({ error: 'You can only update your own reviews.' });

        const product = await Product.findByPk(review.productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await review.destroy();
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
