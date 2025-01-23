const Product = require('../models/product');

const getProductsByCategories = async (req, res) => {
    try {
        const { categories } = req.params;
        const categoryArray = categories.split(',');
        const products = await Product.find({ category: { $in: categoryArray } });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for the given categories' });
        }

        const transformedProducts = products.map((product) => ({
            prodId: product.prodId,
            prodName: product.prodName,
            prodImg: product.prodImg,
            prodDesc: product.prodDesc,
            category: product.category,
            price: parseFloat(product.price.toString()),
            stock: product.stock,
            rating: parseFloat(product.rating.toString()),
        }));

        res.status(200).json(transformedProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getProductsByCategories };
