const express = require('express');
const { createProduct, getProducts, updateProduct, deleteProduct, getProductsByCategory, getProductById } = require('../controllers/product.controller');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', isAuthenticated, isAdmin, createProduct);
router.get('/single/:id', isAuthenticated, getProductById);
router.get('/', getProducts);
router.get('/:id', getProductsByCategory);
router.put('/:id', isAuthenticated, isAdmin, updateProduct);
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct);

module.exports = router;
