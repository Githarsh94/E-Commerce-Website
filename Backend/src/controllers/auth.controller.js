const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
    const { username, email, password, role } = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }
        if (!username || !email || !password || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
    const hashedPassword = await bcrypt.hash(password, 10);
    // normalize role to lowercase to ensure consistent checks
    const normalizedRole = role && role.toString().toLowerCase();
    const user = await User.create({ name: username, email, password: hashedPassword, role: normalizedRole });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await User.findOne({ where: { email } });

        // Verify user exists and password matches
        if (!user || !(await bcrypt.compare(password, user.dataValues.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Normalize roles for comparison
        const requestedRole = role && role.toString().toLowerCase();
        const userRole = user.role && user.role.toString().toLowerCase();

        // If a role was provided in the login request, ensure it matches the stored role
        if (requestedRole && requestedRole !== userRole) {
            return res.status(403).json({ error: 'Role mismatch: the provided role does not match this user' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};