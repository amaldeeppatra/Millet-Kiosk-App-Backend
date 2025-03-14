const Order = require('../models/order');

async function getPlacedOrders(req, res) {
    try{
        const placedOrders = await Order.find({orderStatus: "PLACED"});
        res.json(placedOrders);
    }
    catch(err){
        console.log(err);
        return res.status(500)
    }
}

module.exports = { getPlacedOrders };