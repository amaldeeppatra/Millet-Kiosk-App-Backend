const Product = require('../../models/product');
const Request = require('../../models/request');
const shortid = require('shortid');

async function sendRequestController(req, res){
    const { sellerId } = req.params;
    const { prodId, message, quantity } = req.body;
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
            quantity: quantity || 1,
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

async function getAllRequests(req, res) {
    try {
        const requests = await Request.find().populate("prodId", "prodId prodName category -_id");
        res.status(200).json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Accept request and update stock
async function acceptRequest(req, res) {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        // Find the request
        const request = await Request.findById(id).populate('prodId');
        
        if (!request) {
            return res.status(404).json({ success: false, msg: "Request not found" });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ success: false, msg: "Request already processed" });
        }

        // Validate quantity
        if (!quantity || quantity < 10) {
            return res.status(400).json({ success: false, msg: "Minimum restock amount is 10" });
        }

        // Find and update the product stock using the prodId from the populated request
        const product = await Product.findOne({ prodId: request.prodId.prodId });

        if (!product) {
            return res.status(404).json({ success: false, msg: "Product not found" });
        }

        // Update stock
        product.stock += quantity;
        await product.save();

        // Update request status
        request.status = 'accepted';
        await request.save();

        res.json({ 
            success: true,
            msg: "Request accepted and stock updated successfully", 
            stock: product.stock,
            request 
        });
    } catch (err) {
        console.error("Error accepting request:", err);
        res.status(500).json({ success: false, msg: "Internal server error", message: err.message });
    }
}

// Reject request
async function rejectRequest(req, res) {
    try {
        const { id } = req.params;

        // Find the request
        const request = await Request.findById(id);
        
        if (!request) {
            return res.status(404).json({ success: false, msg: "Request not found" });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ success: false, msg: "Request already processed" });
        }

        // Update request status
        request.status = 'rejected';
        await request.save();

        res.json({ 
            success: true,
            msg: "Request rejected successfully",
            request 
        });
    } catch (err) {
        console.error("Error rejecting request:", err);
        res.status(500).json({ success: false, msg: "Internal server error", message: err.message });
    }
}

module.exports = { 
    sendRequestController, 
    getAllRequestsByIdController, 
    getAllRequests,
    acceptRequest,
    rejectRequest
};