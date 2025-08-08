const Product = require("../models/product");

async function updateProduct(req, res) {
    const { prodId } = req.params; // product id from URL

    try {
        // Find product by id
        const product = await Product.findOne({prodId});

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Update fields dynamically
        Object.keys(req.body).forEach(key => {
            product[key] = req.body[key];
        });

        // Save updated product
        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { updateProduct };