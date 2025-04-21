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

const startServer = async () => {
  await syncDB();
  app.listen(process.env.PORT || 3000, () => console.log("Server running on port 3000"));
};

startServer();
