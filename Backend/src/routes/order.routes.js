const express = require('express');
const { placeOrder, cancelOrder } = require('../controllers/order.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', isAuthenticated, placeOrder);
router.delete('/:id', isAuthenticated, cancelOrder);

module.exports = router;
