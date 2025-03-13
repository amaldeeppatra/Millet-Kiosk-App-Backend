const Product = require("../models/product");

async function updateInventory(req, res) {
    try {
        // Validate request body
        if (!req.body || !req.body.cartItems) {
            return res.status(400).json({ msg: "Request body is missing or invalid" });
        }

        const cartItems = req.body.cartItems;

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ msg: "Cart is empty or missing" });
        }

        // Proceed with inventory update
        for (const item of cartItems) {
            console.log(`Processing item: ${item.prodId}, Quantity: ${item.quantity}`);

            if (!item.prodId || typeof item.quantity !== 'number') {
                return res.status(400).json({ msg: "Invalid cart item format" });
            }

            const product = await Product.findOne({ prodId: item.prodId });

            if (!product) {
                return res.status(404).json({ msg: `Product not found: ${item.prodId}` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ msg: `Not enough stock for ${product.prodName}` });
            }

            product.stock -= item.quantity;
            await product.save();
        }

        res.json({ msg: "Inventory updated successfully" });
    } catch (err) {
        console.error("Error updating inventory:", err);
        res.status(500).json({ msg: "Internal server error" });
    }
}


module.exports = { updateInventory };
