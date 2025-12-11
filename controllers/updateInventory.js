const InventoryItem = require("../models/inventoryItem");
const InventoryLedger = require("../models/inventoryLedger");
const Product = require("../models/product");

async function updateInventory(req, res) {
    try {
        const { shopId } = req.params;   // ⬅️ shopId now comes from URL

        if (!shopId) {
            return res.status(400).json({ msg: "shopId is required in URL" });
        }

        // Validate request body
        if (!req.body || !req.body.cartItems) {
            return res.status(400).json({ msg: "Request body is missing or invalid" });
        }

        const cartItems = req.body.cartItems;

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ msg: "Cart is empty or missing" });
        }

        // Proceed with inventory update (shop-specific)
        for (const item of cartItems) {
            console.log(`Processing item: ${item.prodId}, Quantity: ${item.quantity}`);

            if (!item.prodId || typeof item.quantity !== "number") {
                return res.status(400).json({ msg: "Invalid cart item format" });
            }

            // Find product
            const product = await Product.findOne({ prodId: item.prodId });
            if (!product) {
                return res.status(404).json({ msg: `Product not found: ${item.prodId}` });
            }

            // Find inventory for this shop
            const inventoryItem = await InventoryItem.findOne({
                shopId,
                productId: product._id
            });

            if (!inventoryItem) {
                return res
                    .status(404)
                    .json({ msg: `Inventory not found for ${product.prodName} in this shop` });
            }

            // Check stock
            if (inventoryItem.onHand < item.quantity) {
                return res.status(400).json({
                    msg: `Not enough stock of ${product.prodName} in this shop`,
                });
            }

            // Deduct stock
            inventoryItem.onHand -= item.quantity;
            if (inventoryItem.onHand < 0) inventoryItem.onHand = 0;

            await inventoryItem.save();

            // Ledger entry for SALE
            await InventoryLedger.create({
                shopId,
                productId: product._id,
                type: "SALE",
                refType: "ORDER",
                quantity: item.quantity,
                createdBy: req.body.userId || null,
                note: `Stock deducted due to sale`,
            });
        }

        res.json({ msg: "Inventory updated successfully" });

    } catch (err) {
        console.error("Error updating inventory:", err);
        res.status(500).json({ msg: "Internal server error" });
    }
}

module.exports = { updateInventory };