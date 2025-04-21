const express = require('express');
const { addToCart, getCart, removeFromCart, increaseQuantity, decreaseQuantity } = require('../controllers/cart.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/add', isAuthenticated, addToCart);
router.get('/', isAuthenticated, getCart);
router.delete('/remove/:id', isAuthenticated, removeFromCart);
router.post('/decrease/:id', isAuthenticated, decreaseQuantity);
router.post('/increase/:id', isAuthenticated, increaseQuantity);

module.exports = router;