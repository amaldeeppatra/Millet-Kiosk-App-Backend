const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;
const Decimal128 = require('mongodb').Decimal128;

const productSchema = new Schema({
  prodId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    sparse: true,
  },
  prodName: {
    type: String,
    required: true,
  },
  prodImg: {
    type: String,
    required: true
  },
  prodDesc: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Decimal128,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  rating: {
    type: Decimal128,
    required: true,
  },
  prodIngredients: {
    type: String,
    default: "Not Available"
  },
  prodNutrients: {
    type: String,
    default: "Not Available"
  }
});

const Product = mongoose.models.product || mongoose.model("product", productSchema);

module.exports = Product;