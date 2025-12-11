// const Product = require("../models/product");

// const updateStock = async (req, res) => {
//     try {
//         const { prodId } = req.params;
//         const { quantity } = req.body;

//         if (!quantity || quantity < 10) {
//             return res.status(400).json({ msg: "Minimum restock amount is 10" });
//         }

//         const product = await Product.findOne({ prodId });

//         if (!product) {
//             return res.status(404).json({ msg: "Product not found" });
//         }

//         product.stock += quantity;
//         await product.save();

//         res.json({ msg: "Stock updated successfully", stock: product.stock });
//     } catch (err) {
//         console.error("Error updating stock:", err);
//         res.status(500).json({ msg: "Internal server error" });
//     }
// };

// module.exports = { updateStock };



const Product = require("../models/product");
const InventoryItem = require("../models/inventoryItem");
const InventoryLedger = require("../models/inventoryLedger");

const updateStock = async (req, res) => {
  try {
    const { shopId, prodId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (typeof quantity !== "number" || quantity < 10) {
      return res.status(400).json({ msg: "Minimum restock amount is 10" });
    }

    // Find product by prodId
    const product = await Product.findOne({ prodId });
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Find or create the inventory item for this shop
    let item = await InventoryItem.findOne({
      shopId,
      productId: product._id
    });

    if (!item) {
      item = await InventoryItem.create({
        shopId,
        productId: product._id,
        onHand: 0
      });
    }

    // Update stock
    item.onHand += quantity;
    await item.save();

    // Create a ledger entry
    await InventoryLedger.create({
      shopId,
      productId: product._id,
      type: "RECEIVE",
      refType: "MANUAL",
      quantity,
      note: `Manual restock of ${quantity} units`,
      createdBy: req.user?._id || null
    });

    res.json({
      msg: "Stock updated successfully",
      stock: item.onHand
    });

  } catch (err) {
    console.error("Error updating stock:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { updateStock };