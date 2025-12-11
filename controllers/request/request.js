const Product = require('../../models/product');
const Request = require('../../models/stockRequest');
const shortid = require('shortid');
const InventoryItem = require('../../models/inventoryItem');

async function sendRequestController(req, res) {
  try {
    const { sellerId } = req.params;
    const { prodId, message, quantity, shopId } = req.body;

    if (!shopId) {
      return res.status(400).json({ success: false, message: "shopId is required" });
    }

    const product = await Product.findOne({ prodId });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const newRequest = new Request({
      requestId: `req_${shortid.generate()}`,
      prodId: product._id,
      sellerId,
      shopId,
      message,
      quantity: quantity || 1,
      status: 'pending'
    });

    await newRequest.save();

    res.status(200).json({
      success: true,
      message: 'Request sent successfully',
      data: newRequest
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getAllRequestsByIdController(req, res) {
  try {
    const { sellerId } = req.params;
    const requests = await Request.find({ sellerId })
      .populate("prodId", "prodId prodName category")
      .populate("shopId", "name");   // shop name here

    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getAllRequests(req, res) {
  try {
    const requests = await Request.find()
      .populate("prodId", "prodId prodName category")
      .populate("shopId", "name");

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

    const request = await Request.findById(id).populate("prodId");
    if (!request) return res.status(404).json({ success: false, msg: "Request not found" });

    if (request.status !== "pending")
      return res.status(400).json({ success: false, msg: "Request already processed" });

    if (!quantity || quantity < 10)
      return res.status(400).json({ success: false, msg: "Minimum restock amount is 10" });

    // Update inventory for that shop
    const inventoryItem = await InventoryItem.findOne({
      shopId: request.shopId,
      productId: request.prodId._id
    });

    if (!inventoryItem) {
      // Auto-create inventory row if it doesn't exist
      await InventoryItem.create({
        shopId: request.shopId,
        productId: request.prodId._id,
        onHand: quantity
      });
    } else {
      inventoryItem.onHand += quantity;
      await inventoryItem.save();
    }

    request.status = "accepted";
    await request.save();

    res.json({
      success: true,
      msg: "Request accepted & inventory updated",
      request
    });

  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
}

// Reject request
async function rejectRequest(req, res) {
  try {
    const { id } = req.params;

    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ success: false, msg: "Request not found" });
    if (request.status !== "pending")
      return res.status(400).json({ success: false, msg: "Request already processed" });

    request.status = 'rejected';
    await request.save();

    res.json({ success: true, msg: "Request rejected", request });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
}

module.exports = { 
    sendRequestController, 
    getAllRequestsByIdController, 
    getAllRequests,
    acceptRequest,
    rejectRequest
};