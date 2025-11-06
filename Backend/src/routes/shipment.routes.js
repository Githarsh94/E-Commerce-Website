const express = require('express');
const { trackShipment, updateShipment, listShipments, createShipment } = require('../controllers/shipment.controller');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/track/:id', isAuthenticated, trackShipment);
router.get('/list', isAuthenticated, isAdmin, listShipments);

module.exports = router;