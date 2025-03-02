const { Order, OrderItem } = require('../models');

exports.placeOrder = async (req, res) => {
    try {
        const order = await Order.create({ userId: req.user.id, ...req.body });
        await OrderItem.bulkCreate(req.body.items.map(item => ({ orderId: order.id, ...item })));

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order || order.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

        await order.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
