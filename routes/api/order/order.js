require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const { validateOrder } = require('../../../controllers/validateOrder');
const { updateInventory } = require('../../../controllers/updateInventory');
const { getPlacedOrders } = require('../../../controllers/getPlacedOrders');
const { getCompletedOrders } = require('../../../controllers/getCompletedOrders');
const { completeOrder } = require('../../../controllers/changeOrderStatus');
const { getOrderById } = require('../../../controllers/getOrderById');
const { getOrderByUser } = require('../../../controllers/getOrderByUser');
const InventoryItem = require("../../../models/inventoryItem");

const router = express.Router();

router.get('/user/:userId', getOrderByUser);

router.post('/:shopId', async (req, res) => {
    // try{
    //     const razorpay = new Razorpay({
    //         key_id: process.env.RAZORPAY_KEY_ID,
    //         key_secret: process.env.RAZORPAY_SECRET
    //     });
    
    //     const options = req.body;
    //     const order = await razorpay.orders.create(options);
        
    //     if(!order){
    //         return res.status(500).send('Some error occured');
    //     }

    //     res.json(order);
    // }
    // catch(err){
    //     console.log(err);
    //     return res.status(500).send(err);
    // }

    try {
    const { shopId } = req.params;

    // just log or store shopId somewhere
    if (!shopId) {
      return res.status(400).send("shopId is required in URL");
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET
    });

    const options = req.body;   // ← keep this as YOU wrote it
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Some error occurred");
    }

    // send shopId back for frontend
    res.json({
      shopId,
      order
    });

  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/validate/:shopId', validateOrder);

router.post('/update-inventory/:shopId', updateInventory);

router.get('/get-placed/:shopId', getPlacedOrders);

router.get('/get-completed/:shopId', getCompletedOrders);

router.get('/:shopId/:orderNo', getOrderById);

// PATCH /order/complete/:orderId
router.patch("/complete/:shopId/:orderId", completeOrder);

module.exports = router;