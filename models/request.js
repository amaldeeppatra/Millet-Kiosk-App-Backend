const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const requestSchema = new Schema(
    {
        requestId: {
            type: String,
            required: true,
            unique: true,
            index: true,
            sparse: true,
        },
        prodId: {
            type: String,
            required: true,
        },
        sellerId: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        }
    }
    , { timestamps: true }
)

const Request = model("request", requestSchema);

module.exports = Request;