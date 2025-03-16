const crypto = require('crypto');
const Order = require('../models/order'); 
const sendmail = require('../utils/nodeMailer');

async function validateOrder(req, res) {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature, 
            cartItems, 
            userId, 
            totalPrice, 
            email, 
            name
        } = req.body;

        // Validate signature (unchanged)
        const sha = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
        sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = sha.digest('hex');

        if (digest !== razorpay_signature) {
            return res.status(400).json({ msg: 'Transaction not legit!' });
        }

        // Create order items (unchanged)
        const orderItems = cartItems.map(item => ({
            prodId: item.prodId,
            prodName: item.prodName,
            quantity: item.quantity
        }));

        // Create and save the order (unchanged)
        const newOrder = new Order({
            orderId: razorpay_order_id,
            userId,
            items: orderItems,
            totalPrice,
            transactionId: razorpay_payment_id
        });

        await newOrder.save();

        // Format date for the email
        const orderDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
        
        // Create item list HTML
        const itemsHTML = cartItems.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${item.prodName}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: center;">${item.quantity}</td>
            </tr>
        `).join('');

        // Improved email template
        const subject = 'Your Order Confirmation - Thank You!';
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; color: #333333; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
                <!-- Header with logo -->
                <div style="text-align: center; padding: 20px 0; background-color: #f8f9fa; margin-bottom: 20px;">
                    <h1 style="color: #4a4a4a; margin: 0;">Order Confirmation</h1>
                </div>
                
                <!-- Personal greeting -->
                <div style="margin-bottom: 30px;">
                    <p style="font-size: 16px;">Dear ${name || 'Valued Customer'},</p>
                    <p style="font-size: 16px;">Thank you for your purchase! We're delighted to confirm that your order has been successfully placed and is being processed.</p>
                </div>
                
                <!-- Order details -->
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 30px;">
                    <h2 style="color: #4a4a4a; margin-top: 0; font-size: 18px;">Order Summary</h2>
                    <p><strong>Order ID:</strong> ${razorpay_order_id}</p>
                    <p><strong>Date:</strong> ${orderDate}</p>
                    <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                    <p><strong>Total Amount:</strong> ₹${totalPrice}</p>
                </div>
                
                <!-- Order items -->
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #4a4a4a; font-size: 18px;">Items Ordered</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dddddd;">Product</th>
                                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dddddd;">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHTML}
                        </tbody>
                    </table>
                </div>
                
                <!-- Footer -->
                <div style="text-align: center; padding-top: 30px; border-top: 1px solid #eeeeee; color: #999999; font-size: 12px;">
                    <p>This is a transactional email regarding your recent purchase. You're receiving this because you made a purchase on our website.</p>
                    <p>© 2025 Your Company Name. All rights reserved.</p>
                    <p>123 Commerce Street, Business City, Country</p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Send confirmation email
        sendmail(email, subject, htmlContent);

        // Response unchanged
        res.json({
            message: 'success',
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id
        });
    } catch (err) {
        console.error("Error processing order:", err);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

module.exports = { validateOrder };