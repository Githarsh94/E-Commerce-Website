const express = require("express");
const cors = require("cors");
const { syncDB } = require("./src/models/index");
const dotenv = require('dotenv');
dotenv.config();
const app = express();

app.use(cors());

const productRoutes = require('./src/routes/product.routes');
const authRoutes = require('./src/routes/auth.routes');
const reviewRoutes = require('./src/routes/review.routes');
const orderRoutes = require('./src/routes/order.routes');
const categoryRoutes = require('./src/routes/category.routes');
const cartRoutes = require('./src/routes/cart.routes');
const wishlistRoutes = require('./src/routes/wishlist.routes');
const shipmentRoutes = require('./src/routes/shipment.routes');
const paymentRoutes = require('./src/routes/payment.routes');
const adminRoutes = require('./src/routes/admin.routes');
const addressRoutes = require('./src/routes/address.routes');

app.use(express.json());

app.use('/api/auth', authRoutes);        // Signup (with payments, address, role)
app.use('/api/categories', categoryRoutes); // Admin CRUD for categories
app.use('/api/products', productRoutes); // Admin CRUD for products
app.use('/api/reviews', reviewRoutes);   // Add/edit reviews
app.use('/api/orders', orderRoutes);     // Place/cancel orders
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/shipment', shipmentRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/addresses', addressRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Synchronize database and then export the app
syncDB().then(() => {
  console.log("Database synced successfully for serverless environment.");
}).catch(err => {
  console.error("Failed to sync database:", err);
  process.exit(1); // Exit if DB sync fails
});

// app.listen(process.env.PORT || 3002, () => {
//   console.log(`Server is running on port ${process.env.PORT || 3002}`);
// });

// Export the app for Vercel
module.exports = app;

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
