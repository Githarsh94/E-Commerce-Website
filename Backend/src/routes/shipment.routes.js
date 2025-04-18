const express = require('express');
const { trackShipment, updateShipment } = require('../controllers/shipment.controller');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/track/:id', isAuthenticated, trackShipment);
router.put('/update/:id', isAuthenticated, isAdmin, updateShipment);

module.exports = router;