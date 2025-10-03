const Product = require("../models/product");

const updateStock = async (req, res) => {
    try {
        const { prodId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 10) {
            return res.status(400).json({ msg: "Minimum restock amount is 10" });
        }

        const product = await Product.findOne({ prodId });

        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        product.stock += quantity;
        await product.save();

        res.json({ msg: "Stock updated successfully", stock: product.stock });
    } catch (err) {
        console.error("Error updating stock:", err);
        res.status(500).json({ msg: "Internal server error" });
    }
};

module.exports = { updateStock };
