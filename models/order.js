const { Schema, model, Types } = require("mongoose");

const orderSchema = new Schema(
  {
    orderNo: {
      type: String,
      required: true,
      unique: true,
      index: true,
      sparse: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      sparse: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    items: [
      {
        prodId: {
          type: String,
          required: true,
        },
        prodName: {
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
      type: Types.Decimal128,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
      default: "PLACED",
      enum: ["PLACED", "COMPLETED"],
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
