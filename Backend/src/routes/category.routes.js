const express = require('express');
const categoryController = require('../controllers/category.controller');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.post('/add', isAuthenticated, isAdmin, categoryController.addCategory);
router.put('/update/:id', isAuthenticated, isAdmin, categoryController.updateCategory);
router.delete('/remove/:id', isAuthenticated, isAdmin, categoryController.removeCategory);

module.exports = router;