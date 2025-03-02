const express = require('express');
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', isAuthenticated, isAdmin, createProduct);
router.get('/', getProducts);
router.put('/:id', isAuthenticated, isAdmin, updateProduct);
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct);

module.exports = router;
