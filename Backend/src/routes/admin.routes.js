const express = require('express');
const { getStats } = require('../controllers/admin.controller');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/stats', isAuthenticated, isAdmin, getStats);

module.exports = router;
