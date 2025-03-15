const Order = require('../models/order');

async function getOrderById(req, res){
    try{
        const { orderId } = req.params;
        const order = await Order.findOne({ orderId });
        if (!order){
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json({ order });
    } catch (err){
        console.error("Error updating order:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { getOrderById };