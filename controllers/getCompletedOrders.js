const Order = require('../models/order');

async function getCompletedOrders(req, res) {
    try{
        const placedOrders = await Order.find({orderStatus: "COMPLETED"});
        res.json(placedOrders);
    }
    catch(err){
        console.log(err);
        return res.status(500)
    }
}

module.exports = { getCompletedOrders };