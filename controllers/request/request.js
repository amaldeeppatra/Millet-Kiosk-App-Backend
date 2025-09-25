const Product = require('../../models/product');
const Request = require('../../models/request');
const shortid = require('shortid');

async function sendRequestController(req, res){
    const { sellerId } = req.params;
    const { prodId, message, quantity } = req.body; // Add quantity here
    console.log(`Request to seller ${sellerId} for product ${prodId} with message: ${message} and quantity: ${quantity}`);
    try{
        const product = await Product.findOne({prodId: prodId});
        if(!product){
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const newRequest = new Request({
            requestId: `req_${shortid.generate()}`,
            prodId: product._id,
            sellerId,
            message,
            quantity: quantity || 1, // Add quantity field
            status: 'pending'
        });
        await newRequest.save();
        res.status(200).json({ success: true, message: 'Request sent successfully', data: { sellerId, prodId, message, quantity } });
    } catch (error){
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function getAllRequestsByIdController(req, res){
    const { sellerId } = req.params;
    try{
        const requests = await Request.find({ sellerId }).populate("prodId", "prodId prodName category -_id");
        res.status(200).json({ success: true, requests });
    } catch (error){
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { sendRequestController, getAllRequestsByIdController };