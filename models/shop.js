const { Schema, model } = require("mongoose");

const shopSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true }, // e.g. KORAPUT01
    address: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Shop = model("shop", shopSchema);
module.exports = Shop;