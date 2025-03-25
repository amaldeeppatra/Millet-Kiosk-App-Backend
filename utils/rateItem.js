const Decimal128 = require('mongodb').Decimal128;
const Product = require('../models/product');
const Rating = require('../models/rating');

async function rateItem(req, res) {
  try {
    const { rating, userId } = req.body;
    const prodId = req.params.prodId;
    const parsedRating = parseFloat(rating);
    
    if (isNaN(parsedRating)) {
      return res.status(400).json({ error: 'Invalid rating value.' });
    }
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    // Find if the user has already rated this product
    let existingRating = await Rating.findOne({ prodId, userId });

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = parsedRating;
      await existingRating.save();
    } else {
      // Create a new rating document if none exists
      existingRating = new Rating({
        prodId,
        userId,
        rating: parsedRating,
      });
      await existingRating.save();
    }

    // Recalculate the average rating for this product using aggregation
    const result = await Rating.aggregate([
      { $match: { prodId } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    const avgRating = result[0] ? result[0].avgRating : parsedRating;

    // Update the product with the new average rating
    const updatedProduct = await Product.findOneAndUpdate(
      { prodId },
      { rating: Decimal128.fromString(avgRating.toString()) },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    return res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product rating:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { rateItem };