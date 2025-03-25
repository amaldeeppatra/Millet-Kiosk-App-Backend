const { Schema, model } = require("mongoose");

const ratingSchema = new Schema({
  prodId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

const Rating = model("rating", ratingSchema);

module.exports = Rating;