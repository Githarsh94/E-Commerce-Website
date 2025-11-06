const { sequelize, Review, Product } = require('../models');

// Create a new review and atomically update product aggregates
exports.addReview = async (req, res) => {
    const productId = req.body.productId;
    const ratingValue = Number(req.body.rating) || 0;
    try {
        await sequelize.transaction(async (t) => {
            const product = await Product.findByPk(productId, { transaction: t });
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const alreadyReviewed = await Review.findOne({ where: { userId: req.user.id, ProductId: productId }, transaction: t });
            if (alreadyReviewed) {
                return res.status(400).json({ error: 'You have already reviewed this product' });
            }

            const review = await Review.create({ userId: req.user.id, ProductId: productId, content: req.body.comment, rating: ratingValue }, { transaction: t });

            // update product aggregates: numRatings, numReviews, average rating
            const oldNum = Number(product.numRatings || 0);
            const oldAvg = Number(product.rating || 0);
            const newNum = oldNum + 1;
            const newAvg = newNum > 0 ? ((oldAvg * oldNum) + ratingValue) / newNum : ratingValue;
            await product.update({ numRatings: newNum, numReviews: (Number(product.numReviews || 0) + 1), rating: newAvg }, { transaction: t });

            // return created review
            res.status(201).json(review);
        });
    } catch (error) {
        // If headers already sent inside transaction handler, avoid double-sending
        if (!res.headersSent) res.status(500).json({ error: error.message });
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
    const reviewId = req.params.id;
    try {
        await sequelize.transaction(async (t) => {
            const review = await Review.findByPk(reviewId, { transaction: t });
            if (!review) return res.status(404).json({ error: 'Review not found' });
            if (review.userId !== req.user.id) return res.status(403).json({ error: 'You can only update your own reviews.' });

            const product = await Product.findByPk(req.body.productId || review.ProductId, { transaction: t });
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
                    await product.update({ rating: newAvg }, { transaction: t });
                }
            }

            await review.update(req.body, { transaction: t });
            res.status(200).json(review);
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    const reviewId = req.params.id;
    try {
        await sequelize.transaction(async (t) => {
            const review = await Review.findByPk(reviewId, { transaction: t });
            if (!review || review.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
            if (review.userId !== req.user.id) return res.status(403).json({ error: 'You can only update your own reviews.' });

            const product = await Product.findByPk(review.ProductId, { transaction: t });
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

            await review.destroy({ transaction: t });
            await product.update({ numRatings: newNum, numReviews: Math.max(0, Number(product.numReviews || 0) - 1), rating: newAvg }, { transaction: t });

            res.status(200).json({ message: 'Review deleted successfully' });
        });
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ error: error.message });
    }
}
