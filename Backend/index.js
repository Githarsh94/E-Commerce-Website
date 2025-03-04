const express = require("express");
const {syncDB } = require("./src/models/index");
const dotenv = require('dotenv');
dotenv.config();
const app = express();


const productRoutes = require('./src/routes/product.routes');
const authRoutes = require('./src/routes/auth.routes');
const reviewRoutes = require('./src/routes/review.routes');
const orderRoutes = require('./src/routes/order.routes');
const categoryRoutes = require('./src/routes/category.routes');

app.use(express.json());

app.use('/api/auth', authRoutes);        // Signup (with payments, address, role)
app.use('/api/categories', categoryRoutes); // Admin CRUD for categories
app.use('/api/products', productRoutes); // Admin CRUD for products
app.use('/api/reviews', reviewRoutes);   // Add/edit reviews
app.use('/api/orders', orderRoutes);     // Place/cancel orders

const startServer = async () => {
  await syncDB();
  app.listen(process.env.PORT || 3000, () => console.log("Server running on port 3000"));
};

startServer();


