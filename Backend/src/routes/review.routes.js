const express = require('express');
const { addReview, updateReview, getReviews, deleteReview, getReviewsByProductId } = require('../controllers/review.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', isAuthenticated, addReview);
router.get('/', getReviews);
router.get('/:id', getReviewsByProductId);
router.put('/:id', isAuthenticated, updateReview);
router.delete('/:id', isAuthenticated, deleteReview);

module.exports = router;
