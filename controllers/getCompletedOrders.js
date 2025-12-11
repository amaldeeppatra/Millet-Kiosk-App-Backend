const Order = require('../models/order');

async function getCompletedOrders(req, res) {
    try {
        const { shopId } = req.params;   // ⬅️ shopId from URL

        if (!shopId) {
            return res.status(400).json({ error: "shopId is required" });
        }

        const completedOrders = await Order.find({
                orderStatus: "COMPLETED",
                shopId: shopId            // ⬅️ filter by shop
            })
            .populate('userId', 'name email');

        res.json(completedOrders);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Server error while fetching completed orders" });
    }
}

module.exports = { getCompletedOrders };