const { Order, OrderItem, Address, Product } = require('../models');
const { Op } = require('sequelize');

// Place a new order
exports.placeOrder = async (req, res) => {
    try {
        // Validate request body
        if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
            return res.status(400).json({ error: 'Order items are required and must be an array.' });
        }

        // Build a products snapshot (productId + quantity) to store on the order
        const productsSnapshot = req.body.items.map(i => ({ productId: i.productId, quantity: i.quantity }));

        // Create the order (store a products JSON snapshot for easy reads)
        const order = await Order.create({ userId: req.user.id, totalAmount: req.body.totalAmount || 0, shippingAddress: req.body.shippingAddress || null, products: productsSnapshot });

        // Create order items (price and quantity expected from frontend)
        const orderItems = req.body.items.map(item => ({ orderId: order.id, productId: item.productId, quantity: item.quantity, price: item.price || 0 }));
        await OrderItem.bulkCreate(orderItems);

        // Fetch the created order with items and product details to return to client
        const created = await Order.findByPk(order.id, {
            include: [{ model: OrderItem, as: 'orderItems', include: [{ model: Product, as: 'product' }] }]
        });

        res.status(201).json(created);
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

// Get orders for the authenticated user (supports pagination)
exports.getOrders = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const limit = parseInt(req.query.limit, 10) || 20;
        const offset = parseInt(req.query.offset, 10) || 0;

        const orders = await Order.findAll({
            where: { userId },
            include: [{ model: OrderItem, as: 'orderItems', include: [{ model: Product, as: 'product' }] }],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.status(200).json({ data: orders, limit, offset });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: get all orders (supports pagination & optional search)
exports.getAllOrders = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 50;
        const offset = parseInt(req.query.offset, 10) || 0;
        const search = (req.query.search || '').toString().trim();

        const where = {};
        if (search) {
            // allow searching by order id or status
            where[Op.or] = [
                { id: search },
                { status: search }
            ];
        }

        const orders = await Order.findAll({
            where,
            include: [{ model: OrderItem, as: 'orderItems', include: [{ model: Product, as: 'product' }] }],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.status(200).json({ data: orders, limit, offset });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: update an order's status (by id)
exports.updateOrderStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await Order.findByPk(id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        const incoming = (req.body.status || '').toString().toLowerCase().trim();
        if (!incoming) return res.status(400).json({ error: 'status is required' });

    let mapped = null;
    // Map incoming free-text to canonical order.status values.
    if (incoming.includes('delivered')) mapped = 'delivered';
    else if (incoming.includes('out for delivery')) mapped = 'out for delivery';
    else if (incoming.includes('in transit')) mapped = 'in transit';
    else if (incoming.includes('shipped')) mapped = 'shipped';
    else if (incoming.includes('processing') || incoming.includes('pending')) mapped = 'processing';
    else if (incoming.includes('cancel')) mapped = 'cancelled';

        if (!mapped) return res.status(400).json({ error: 'unsupported status value' });

        if (mapped !== order.status) {
            order.status = mapped;
            await order.save();
        }

        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
