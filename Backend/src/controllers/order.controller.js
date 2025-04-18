const { Order, OrderItem } = require('../models');

// Place a new order
exports.placeOrder = async (req, res) => {
    try {
        // Validate request body
        if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
            return res.status(400).json({ error: 'Order items are required and must be an array.' });
        }

        // Create the order
        const order = await Order.create({ userId: req.user.id, ...req.body });

        // Create order items
        const orderItems = req.body.items.map(item => ({ orderId: order.id, ...item }));
        await OrderItem.bulkCreate(orderItems);

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cancel an existing order
exports.cancelOrder = async (req, res) => {
    try {
        // Find the order by ID
        const order = await Order.findByPk(req.params.id);

        // Check if the order exists and belongs to the user
        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }
        if (order.userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to cancel this order.' });
        }

        // Delete the order
        await order.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
