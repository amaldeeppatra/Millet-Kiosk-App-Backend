const crypto = require('crypto');
const Order = require('../models/order'); // Import Order model

async function validateOrder(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartItems, userId, totalPrice } = req.body;

        // Validate Payment Signature
        const sha = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
        sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = sha.digest('hex');

        if (digest !== razorpay_signature) {
            return res.status(400).json({ msg: 'Transaction not legit!' });
        }

        // Construct order items from cartItems
        const orderItems = cartItems.map(item => ({
            prodId: item.prodId,
            prodName: item.prodName,
            quantity: item.quantity
        }));

        // Create and save the order in the database
        const newOrder = new Order({
            orderId: razorpay_order_id,
            userId,
            items: orderItems,
            totalPrice,
            transactionId: razorpay_payment_id // Store Razorpay transaction ID
        });

        await newOrder.save(); // Save to database

        res.json({
            message: 'success',
            orderId: newOrder.orderId,
            paymentId: newOrder.transactionId
        });
    } catch (err) {
        console.error("Error processing order:", err);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

module.exports = { validateOrder };
