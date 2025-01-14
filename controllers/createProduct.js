const Product = require("../models/product");

async function createProduct(req, res){
    const { prodId, prodName, category, price, stock } = req.body;
    try{
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({
            success: true,
            prodId: newProduct.prodId,
            prodName: newProduct.prodName,
            category: newProduct.category,
            price: newProduct.price,
            stock: newProduct.stock
        });
    } catch (error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { createProduct };