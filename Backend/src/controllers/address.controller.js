const { Address, User } = require('../models/index');

// Get all addresses for the authenticated user
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
    res.json({ addresses });
  } catch (error) {
    console.error('getAddresses error', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

exports.getAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findOne({ where: { id, userId: req.user.id } });
    if (!address) return res.status(404).json({ error: 'Address not found' });
    res.json({ address });
  } catch (error) {
    console.error('getAddress error', error);
    res.status(500).json({ error: 'Failed to fetch address' });
  }
};

// Create a new address for authenticated user
exports.createAddress = async (req, res) => {
  try {
    const payload = req.body;
    // If isDefault is true, unset other defaults
    if (payload.isDefault) {
      await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    }

    const address = await Address.create({ ...payload, userId: req.user.id });
    res.status(201).json({ address });
  } catch (error) {
    console.error('createAddress error', error);
    res.status(500).json({ error: 'Failed to create address' });
  }
};

// Update an existing address (must belong to user)
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const address = await Address.findOne({ where: { id, userId: req.user.id } });
    if (!address) return res.status(404).json({ error: 'Address not found' });

    if (payload.isDefault) {
      await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    }

    await address.update(payload);
    res.json({ address });
  } catch (error) {
    console.error('updateAddress error', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findOne({ where: { id, userId: req.user.id } });
    if (!address) return res.status(404).json({ error: 'Address not found' });

    await address.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('deleteAddress error', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
};
