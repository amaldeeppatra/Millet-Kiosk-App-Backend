require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const { validateOrder } = require('../controllers/validateOrder');
const { updateInventory } = require('../controllers/updateInventory');
const { getPlacedOrders } = require('../controllers/getPlacedOrders');
const { getCompletedOrders } = require('../controllers/getCompletedOrders');
const { completeOrder } = require('../controllers/changeOrderStatus');

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

router.post('/validate', validateOrder);

router.post('/update-inventory', updateInventory);

router.get('/get-placed', getPlacedOrders);

router.get('/get-completed', getCompletedOrders);

// PATCH /order/complete/:orderId
router.patch("/complete/:orderId", completeOrder);

module.exports = router;