const Shipment = require('../models/shipment');

exports.trackShipment = async (req, res) => {
    try {
        const { id } = req.params;
        const shipment = await Shipment.findByPk(id);
        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }
        res.status(200).json(shipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateShipment = async (req, res) => {
    try {
        const { id } = req.params;
        const shipment = await Shipment.findByPk(id);
        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }
        await shipment.update(req.body);
        res.status(200).json(shipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};