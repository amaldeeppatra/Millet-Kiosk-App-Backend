const Order = require('../models/order');

// async function completeOrder(req, res){
//     try {
//         const { orderId } = req.params;

//         // Find the order using the provided orderId
//         const order = await Order.findOne({ orderId });
//         if (!order) {
//         return res.status(404).json({ error: "Order not found" });
//         }

//         // Ensure the order is currently in 'PLACED' status before updating
//         if (order.orderStatus !== "PLACED") {
//         return res.status(400).json({ error: "Only orders with status PLACED can be updated to COMPLETED" });
//         }

//         // Update the status to COMPLETED and save
//         order.orderStatus = "COMPLETED";
//         await order.save();

//         res.status(200).json({ message: "Order status updated to COMPLETED", order });
//     } catch (err) {
//         console.error("Error updating order:", err);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }

async function completeOrder(req, res){
    try {
        const { orderId } = req.params;

        // Find and update the order in one operation
        const order = await Order.findOneAndUpdate(
            { orderId, orderStatus: "PLACED" }, // Only update if status is PLACED
            { orderStatus: "COMPLETED" },
            { new: true } // Return the updated document
        );

        if (!order) {
            return res.status(404).json({ 
                error: "Order not found or not in PLACED status" 
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