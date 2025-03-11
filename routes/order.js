require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');

const router = express.Router();

router.post('/', async (req, res) => {
    try{
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
        });
    
        const options = req.body;
        const order = await razorpay.orders.create(options);
        
        if(!order){
            return res.status(500).send('Some error occured');
        }

        res.json(order);
    }
    catch(err){
        console.log(err);
        return res.status(500).send(err);
    }
})

module.exports = router;