const Order = require('../models/order');

async function getOrderById(req, res) {
    try {
        const { orderNo, shopId } = req.params;  // ⬅️ now taking shopId from URL

        if (!shopId) {
            return res.status(400).json({ error: "shopId is required" });
        }

        // find order only inside this shop
        const order = await Order.findOne({ orderNo, shopId });

        if (!order) {
            return res.status(404).json({ error: "Order not found for this shop" });
        }

        res.status(200).json({ order });

    } catch (err) {
        console.error("Error fetching order:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { getOrderById };