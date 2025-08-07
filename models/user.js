const { Schema, model } = require("mongoose");

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
  },
  { timestamps: true }
);

const User = model("user", userSchema);

module.exports = User;
