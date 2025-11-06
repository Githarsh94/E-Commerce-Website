const Shipment = require('../models/shipment');
const { Order } = require('../models');

// List shipments (admin) with pagination
exports.listShipments = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 20;
        const offset = parseInt(req.query.offset, 10) || 0;

        const shipments = await Shipment.findAll({
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.status(200).json({ data: shipments, limit, offset });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Track shipment by id (pk) or trackingNumber
exports.trackShipment = async (req, res) => {
    try {
        const { id } = req.params;
        // try by primary key first
        let shipment = await Shipment.findByPk(id);
        if (!shipment) {
            // fallback: try lookup by tracking number
            shipment = await Shipment.findOne({ where: { trackingNumber: id } });
        }
        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }
        res.status(200).json(shipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update shipment (simple: update shipment fields only)
