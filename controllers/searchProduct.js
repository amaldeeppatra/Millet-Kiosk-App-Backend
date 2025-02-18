const Product = require('../models/product');

const searchProducts = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ error: 'No search query provided.' });
    }

    // Use a case-insensitive regular expression for partial matches.
    const products = await Product.find({
      prodName: { $regex: query, $options: 'i' }
    });

    res.json(products);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { searchProducts };