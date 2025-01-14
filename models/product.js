const { Schema, model } = require("mongoose");
const Decimal128 = require('mongodb').Decimal128;

const productSchema = new Schema({
    prodId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        sparse: true
    },
    prodName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Decimal128,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
})

const Product = model("product", productSchema);

module.exports = Product;