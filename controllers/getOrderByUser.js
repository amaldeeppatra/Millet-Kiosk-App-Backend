const Order = require('../models/order');

async function getOrderByUser(req, res){
    try{
        const { userId } = req.params;
        const orders = await Order.find({ userId });
        if (!orders){
            return res.status(404).json({ error: "No orders found" });
        }
        res.status(200).json({ orders });
    } catch (err){
        console.error("Error updating order:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { getOrderByUser };