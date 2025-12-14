const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

// const requestSchema = new Schema(
//     {
//         requestId: {
//             type: String,
//             required: true,
//             unique: true,
//             index: true,
//             sparse: true,
//         },
//         prodId: {
//             type: Schema.Types.ObjectId,
//             ref: 'product',
//             required: true,
//         },
//         sellerId: {
//             type: Schema.Types.ObjectId,
//             ref: 'user',
//             required: true,
//         },
//         quantity: {
//             type: Number,
//             required: true,
//         },
//         message: {
//             type: String,
//             required: true,
//         },
//         status: {
//             type: String,
//             enum: ['pending', 'accepted', 'rejected'],
//             default: 'pending',
//         }
//     }
//     , { timestamps: true }
// )

const requestSchema = new Schema(
    {
        requestId: { type: String, required: true, unique: true, index: true },
        shopId: { type: Schema.Types.ObjectId, ref: "shop", required: true },
        prodId: { type: Schema.Types.ObjectId, ref: "product", required: true },
        sellerId: { type: Schema.Types.ObjectId, ref: "user", required: true },
        quantity: { type: Number, required: true },
        message: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: "pending",
        },
        decidedBy: { type: Schema.Types.ObjectId, ref: "user" },
    },
    { timestamps: true }
);

// const Request = model("request", requestSchema);
const Request = mongoose.models.request || mongoose.model("request", requestSchema);

module.exports = Request;