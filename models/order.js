const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    orderId: {
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
    paymentStatus: {
      type: String,
      required: true,
      default: "PENDING",
      enum: ["PENDING", "COMPLETED", "FAILED"],
    },
    orderStatus: {
      type: String,
      required: true,
      default: "PLACED",
      enum: ["PLACED", "PROCESSING", "COMPLETED", "CANCELLED"],
    },
    transactionId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Order = model("order", orderSchema);

module.exports = Order;
