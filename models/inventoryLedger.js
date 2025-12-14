const { Schema, model } = require("mongoose");

const inventoryLedgerSchema = new Schema(
  {
    shopId: { type: Schema.Types.ObjectId, ref: "shop", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "product", required: true },
    type: {
      type: String,
      enum: ["RECEIVE", "SALE", "ADJUST", "REQUEST_APPROVAL"],
      required: true,
    },
    quantity: { type: Number, required: true },
    refType: { type: String, enum: ["ORDER", "REQUEST", "ADMIN"], required: true },
    refId: { type: Schema.Types.ObjectId },
    note: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

inventoryLedgerSchema.index({ shopId: 1, productId: 1, createdAt: -1 });

const InventoryLedger = model("inventoryLedger", inventoryLedgerSchema);
module.exports = InventoryLedger;