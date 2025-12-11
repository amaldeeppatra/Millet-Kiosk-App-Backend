const Order = require('../models/order');

async function getPlacedOrders(req, res) {
    try {
        const { shopId } = req.params;  // ⬅️ shopId comes from URL

        if (!shopId) {
            return res.status(400).json({ error: "shopId is required" });
        }

        const placedOrders = await Order.find({
                orderStatus: "PLACED",
                shopId: shopId         // ⬅️ filter by shop
            })
            .populate('userId', 'name email')
            .exec();
            
        res.json(placedOrders);
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({ error: "Server error while fetching orders" });
    }
}

module.exports = { getPlacedOrders };