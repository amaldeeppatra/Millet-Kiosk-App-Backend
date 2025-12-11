const express = require('express');
const router = express.Router();

const Order = require('../../../models/order');

// Get all orders
// router.get('/', async (req, res) => {
//     try {
//         const { shopId } = req.query;   // optional filter

//         let filter = {};

//         // If shopId is passed → filter orders for that shop
//         if (shopId) {
//             filter.shopId = shopId;
//         }

//         // If user is a seller → force filter by seller’s shop
//         if (req.user && req.user.role === "SELLER") {
//             filter.shopId = req.user.shopId;
//         }

//         // If user is admin → they can see all orders (no filter override)
//         // If no user → show all orders (for testing only)

//         const orders = await Order.find(filter)
//             .populate('userId', 'name email')
//             .sort({ createdAt: -1 });

//         res.json(orders);

//     } catch (err) {
//         res.status(500).json({ msg: "Error fetching orders", error: err.message });
//     }
// });

router.get('/:shopId', async (req, res) => {
    try{
        const { shopId } = req.params;

        const orders = await Order.find({ shopId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: "Error fetching orders", error: err.message });
    }
})

module.exports = router;