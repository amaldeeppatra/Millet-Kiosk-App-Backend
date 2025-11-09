const Product = require('../models/product');

const deleteProduct = async (req, res) => {
    try {
        const { prodId } = req.params;
        const deletedProduct = await Product.findOneAndDelete({ prodId });
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = deleteProduct;