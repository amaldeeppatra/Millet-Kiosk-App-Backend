const InventoryItem = require("../../models/inventoryItem");
const Product = require("../../models/product");

async function createInventoryItem(req, res) {
  try {
    const { shopId } = req.params;
    const { prodId, onHand } = req.body;

    if (!shopId) {
      return res.status(400).json({ msg: "shopId is required in URL" });
    }

    if (!prodId || onHand == null) {
      return res.status(400).json({ msg: "prodId and onHand are required" });
    }

    // Find the product
    const product = await Product.findOne({ prodId });
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Check if already exists
    const existing = await InventoryItem.findOne({
      shopId,
      productId: product._id,
    });

    if (existing) {
      return res.status(400).json({ msg: "Inventory item already exists for this shop & product" });
    }

    // Create new inventory record
    const newItem = await InventoryItem.create({
      shopId,
      productId: product._id,
      onHand,
    });

    res.status(201).json({
      msg: "Inventory item created successfully",
      inventoryItem: newItem,
    });

  } catch (err) {
    console.error("Error creating inventory item:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
}

module.exports = { createInventoryItem };