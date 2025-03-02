const Review = require('../models/review');

exports.addReview = async (req, res) => {
    try {
        const review = await Review.create({ userId: req.user.id, ...req.body });
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review || review.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

        await review.update(req.body);
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
