const { Product, Category, Order, User } = require('../models');

exports.getStats = async (req, res) => {
  try {
    const productsCount = await Product.count();
    const categoriesCount = await Category.count();
    const ordersCount = await Order.count();
    const revenue = await Order.sum('totalAmount') || 0;
    const customersCount = await User.count();

    // recent products (latest 5)
    const recentProductsRaw = await Product.findAll({ limit: 5, order: [['createdAt', 'DESC']] });
    const recentProducts = recentProductsRaw.map(p => ({ id: p.id, name: p.name || p.title || `Product ${p.id}` }));

    res.json({ productsCount, categoriesCount, ordersCount, revenue, customersCount, recentProducts });
  } catch (err) {
    console.error('Admin stats error', err);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
};
