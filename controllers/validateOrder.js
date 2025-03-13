const crypto = require('crypto');

async function validateOrder (req, res) {
    try{
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const sha = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
        sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = sha.digest('hex');
        if (digest !== razorpay_signature){
            return res.status(400).json({msg: 'Transaction not legit!'});
        }

        res.json({
            msg: 'Payment successful!',
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id
        });
    } catch (err) {
        console.log(err);
        return res.status(500);
    }
}

module.exports = { validateOrder };