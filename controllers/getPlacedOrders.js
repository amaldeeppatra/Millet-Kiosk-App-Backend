const Order = require('../models/order');

async function getPlacedOrders(req, res) {
    try {
        const placedOrders = await Order.find({orderStatus: "PLACED"})
            .populate('userId', 'name email') // Populate user details
            .exec();
            
        res.json(placedOrders);
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({ error: "Server error while fetching orders" });
    }
}

module.exports = { getPlacedOrders };