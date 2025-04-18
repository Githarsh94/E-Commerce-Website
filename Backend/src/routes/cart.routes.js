const express = require('express');
const { addToCart, getCart, removeFromCart } = require('../controllers/cart.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/add', isAuthenticated, addToCart);
router.get('/', isAuthenticated, getCart);
router.delete('/remove/:id', isAuthenticated, removeFromCart);

module.exports = router;