const express = require('express');
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlist.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/add', isAuthenticated, addToWishlist);
router.get('/', isAuthenticated, getWishlist);
router.delete('/remove/:id', isAuthenticated, removeFromWishlist);

module.exports = router;