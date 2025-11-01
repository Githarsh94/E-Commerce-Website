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
        const ratingValue = Number(req.body.rating) || 0;
        const review = await Review.create({ userId: req.user.id, ProductId: req.body.productId, content: req.body.comment, rating: ratingValue });

        // update product aggregates: numRatings, numReviews, average rating
        const oldNum = Number(product.numRatings || 0);
        const oldAvg = Number(product.rating || 0);
        const newNum = oldNum + 1;
        const newAvg = ((oldAvg * oldNum) + ratingValue) / newNum;
        await product.update({ numRatings: newNum, numReviews: (Number(product.numReviews || 0) + 1), rating: newAvg });

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
        const reviews = await Review.findAll({ where: { ProductId: req.params.id } });
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

        // if rating changed, adjust product average
        const oldRating = Number(review.rating || 0);
        const newRating = Number(req.body.rating != null ? req.body.rating : oldRating);
        if (newRating !== oldRating) {
            const num = Number(product.numRatings || 0) || 0;
            if (num > 0) {
                const oldAvg = Number(product.rating || 0);
                const newAvg = ((oldAvg * num) - oldRating + newRating) / num;
                await product.update({ rating: newAvg });
            }
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

        const product = await Product.findByPk(review.ProductId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // adjust aggregates
        const oldNum = Number(product.numRatings || 0);
        const oldAvg = Number(product.rating || 0);
        const reviewRating = Number(review.rating || 0);
        let newNum = Math.max(0, (oldNum - 1));
        let newAvg = 0;
        if (newNum > 0) {
            newAvg = ((oldAvg * oldNum) - reviewRating) / newNum;
        }

        await review.destroy();
        await product.update({ numRatings: newNum, numReviews: Math.max(0, Number(product.numReviews || 0) - 1), rating: newAvg });

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
