const express = require('express');
const { placeOrder, cancelOrder, getOrders, getAllOrders, updateOrderStatus } = require('../controllers/order.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', isAuthenticated, placeOrder);
router.get('/', isAuthenticated, getOrders);
router.get('/all', isAuthenticated, isAdmin, getAllOrders);
router.delete('/:id', isAuthenticated, cancelOrder);
router.put('/:id/status', isAuthenticated, isAdmin, updateOrderStatus);

module.exports = router;
