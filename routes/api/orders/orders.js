const express = require('express');
const router = express.Router();

const Order = require('../../../models/order');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email'); // Fetch all orders from the database
        res.json(orders);
    } catch (err) {
        res.status(500).send('Error fetching orders: ' + err.message);
    }
});

module.exports = router;