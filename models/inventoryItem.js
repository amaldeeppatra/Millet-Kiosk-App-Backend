const { Schema, model } = require("mongoose");

const inventoryItemSchema = new Schema(
  {
    shopId: { type: Schema.Types.ObjectId, ref: "shop", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "product", required: true },
    onHand: { type: Number, required: true },
  },
  { timestamps: true }
);

inventoryItemSchema.index({ shopId: 1, productId: 1 }, { unique: true });

const InventoryItem = model("inventoryItem", inventoryItemSchema);
module.exports = InventoryItem;