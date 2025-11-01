const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

// All routes require authentication; users manage only their addresses
router.get('/', isAuthenticated, addressController.getAddresses);
router.get('/:id', isAuthenticated, addressController.getAddress);
router.post('/', isAuthenticated, addressController.createAddress);
router.put('/:id', isAuthenticated, addressController.updateAddress);
router.delete('/:id', isAuthenticated, addressController.deleteAddress);

module.exports = router;
