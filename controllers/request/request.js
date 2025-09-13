const Request = require('../../models/request');
const shortid = require('shortid');

async function sendRequestController(req, res){
    const { sellerId } = req.params;
    const { prodId, message } = req.body;
    console.log(`Request to seller ${sellerId} for product ${prodId} with message: ${message}`);
    try{
        const newRequest = new Request({
            requestId: `req_${shortid.generate()}`,
            prodId,
            sellerId,
            message,
            status: 'pending'
        });
        await newRequest.save();
    } catch (error){
        return res.status(500).json({ success: false, message: error.message });
    }
    res.status(200).json({ success: true, message: 'Request sent successfully', data: { sellerId, prodId, message } });
}

module.exports = sendRequestController;