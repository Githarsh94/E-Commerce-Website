const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isAuthenticated = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1]; // Extract token from 'Bearer <token>'
        if (!token) return res.status(401).json({ error: 'Access Denied. No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findByPk(decoded.id);

        if (!req.user) return res.status(401).json({ error: 'Invalid token' });

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        if (!req.user) return res.status(403).json({ error: 'Unauthorized' });

        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
