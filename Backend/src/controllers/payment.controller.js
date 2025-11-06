const { Payment, Shipment, Order } = require('../models');

exports.processPayment = async (req, res) => {
    try {
        let { orderId, amount, method } = req.body;

        // Ensure a valid method is provided; default to 'Cash on delivery' if missing
        const allowed = ["debit card", "credit card", "UPI", "Cash on delivery"];
        if (!method || !allowed.includes(method)) method = 'Cash on delivery';

        // Create payment record (status starts as Processing)
        const payment = await Payment.create({ orderId, amount, method, status: 'Pending' });

        // Simulate payment processing logic here
        payment.status = 'Completed';
        await payment.save();

        // Update order status to 'processing' (keeps compatibility with existing enum)
        if (orderId) {
            try {
                const order = await Order.findByPk(orderId);
                if (order) {
                    order.status = 'processing';
                    await order.save();
                }
            } catch (err) {
                // Log but don't fail the payment response because shipment/order update is best-effort
                console.error('Failed to update order status after payment:', err);
            }
        }

        // Return payment and the order (with items) so frontend can show details
        let orderWithItems = null;
        if (orderId) {
            try {
                orderWithItems = await Order.findByPk(orderId, {
                    include: [{ model: require('../models').OrderItem, as: 'orderItems' }]
                });
            } catch (err) {
                // ignore failures to fetch order
                console.error('failed to load order after payment', err);
            }
        }

        res.status(201).json({ payment, order: orderWithItems });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.initiateShipment = async (req, res) => {
    try {
        const { orderId, address } = req.body;
        // Logic to initiate shipment (e.g., integrate with a shipping service)
        const shipment = await Shipment.create({ orderId, address, status: 'Shipped' });
        res.status(201).json(shipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByPk(id);
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getShipmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const shipment = await Shipment.findByPk(id);
        if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
        res.status(200).json(shipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};