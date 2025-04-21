const Product = require('../models/product');

const Category = require('../models/category');


exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categoryId, image_url } = req.body;
        const category = await Category.findByPk(categoryId);
        if (!category) return res.status(400).json({ error: 'Invalid categoryId' });
        const product = await Product.create({ name, description, price, stock, categoryId, image_url });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) return res.status(400).json({ error: 'Invalid categoryId' });

        const products = await Product.findAll({ where: { categoryId: id } });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categoryId } = req.body;

        if (!name || !description || !price || !stock || !categoryId) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const category = await Category.findByPk(categoryId);
        if (!category) return res.status(400).json({ error: 'Invalid categoryId' });

        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        await product.update({ name, description, price, stock, categoryId });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        await product.destroy();
        res.status(200).json({ message: 'Product removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
