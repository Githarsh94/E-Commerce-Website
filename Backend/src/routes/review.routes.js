const express = require('express');
const { addReview, updateReview } = require('../controllers/review.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', isAuthenticated, addReview);
router.put('/:id', isAuthenticated, updateReview);

module.exports = router;
