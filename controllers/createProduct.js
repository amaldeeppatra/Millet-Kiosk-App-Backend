const Product = require("../models/product");

async function createProduct(req, res) {
    // const { prodId, prodName, prodDesc, category, price, stock, rating, prodImg } = req.body;
    const { prodId, prodName, prodDesc, category, price, rating, prodImg } = req.body;
    try {
        // const prodImg = req.file ? req.file.path : null;
        const newProduct = new Product({
            prodId,
            prodName,
            prodDesc,
            category,
            price,
            // stock,
            rating,
            prodImg
        });
        await newProduct.save();
        res.status(201).json({
            success: true,
            prodId: newProduct.prodId,
            prodName: newProduct.prodName,
            prodImg: newProduct.prodImg,
            prodDesc: newProduct.prodDesc,
            category: newProduct.category,
            price: newProduct.price,
            // stock: newProduct.stock,
            rating: newProduct.rating
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { createProduct };