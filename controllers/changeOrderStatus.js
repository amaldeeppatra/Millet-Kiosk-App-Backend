const Order = require('../models/order');

async function completeOrder(req, res) {
    try {
        const { orderId, shopId } = req.params;   // ⬅️ shopId + orderId

        if (!shopId) {
            return res.status(400).json({ error: "shopId is required" });
        }

        // Update ONLY the order that:
        // 1. Belongs to this shop
        // 2. Is currently in PLACED state
        const order = await Order.findOneAndUpdate(
            { orderId, shopId, orderStatus: "PLACED" },
            { orderStatus: "COMPLETED" },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                error: "Order not found in this shop or not in PLACED status"
            });
        }

        res.status(200).json({
            message: "Order status updated to COMPLETED",
            order
        });

    } catch (err) {
        console.error("Error updating order:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { completeOrder };