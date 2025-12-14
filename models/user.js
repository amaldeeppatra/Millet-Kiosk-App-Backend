const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      sparse: true,
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      required: true,
      default: "CUSTOMER",
      enum: ["CUSTOMER", "SELLER", "ADMIN"],
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "shop",
      default: null, // seller: has, customer/admin: null
    },
  },
  { timestamps: true }
);

// const User = model("user", userSchema);
const User = mongoose.models.user || mongoose.model("user", userSchema);

module.exports = User;