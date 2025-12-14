const InventoryItem = require("../../models/inventoryItem");
const Product = require("../../models/product");

// get inventory for all products in a specific shop
async function getInventoryForShop(req, res) {
  try {
    const { shopId } = req.params;

    const items = await InventoryItem.find({ shopId })
      .populate("productId", "prodId prodName prodImg price category");

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
}

// get inventory for a specific product in a specific shop
async function getInventoryForProduct(req, res) {
  try {
    const { shopId, prodId } = req.params;

    const product = await Product.findOne({ prodId });
    if (!product) return res.status(404).json({ msg: "Product not found" });

    const inventory = await InventoryItem.findOne({
      shopId,
      productId: product._id
    });

    // if (!inventory)
    //   return res.status(404).json({ msg: "Inventory not found for this shop" });
    if (!inventory) {
      return res.json({
        prodId: product.prodId,
        prodName: product.prodName,
        stock: 0  // Not stocked means zero available
      });
    }

    res.json({
      prodId: product.prodId,
      prodName: product.prodName,
      stock: inventory.onHand
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
}

module.exports = { getInventoryForShop, getInventoryForProduct };