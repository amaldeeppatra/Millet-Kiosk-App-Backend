const Product = require('../models/product');

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.find({ prodId: id });

        if (product.length === 0) {
            return res.status(404).json({ message: 'No product found for the given ID' });
        }

        const transformedProduct = product.map((product) => ({
            prodId: product.prodId,
            prodName: product.prodName,
            prodImg: product.prodImg,
            prodDesc: product.prodDesc,
            category: product.category,
            price: parseFloat(product.price.toString()),
            // stock: product.stock,
            rating: parseFloat(product.rating.toString()),
        }));

        res.status(200).json(transformedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getProductById };
