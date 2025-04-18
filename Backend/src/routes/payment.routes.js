const express = require('express');
const { processPayment, getPaymentStatus } = require('../controllers/payment.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/process', isAuthenticated, processPayment);
router.get('/status/:id', isAuthenticated, getPaymentStatus);

module.exports = router;