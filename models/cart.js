const { Schema, model } = require("mongoose");

const cartSchema = new Schema(
  {
    cartId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      sparse: true,
    },
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        prodId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Decimal128,
      required: true,
    },
  },
  { timestamps: true }
);

const Cart = model("cart", cartSchema);

module.exports = Cart;
