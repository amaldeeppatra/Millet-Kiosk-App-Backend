const express = require('express');
const router = express.Router();
const { getProductsByCategories } = require('../../../controllers/getProdCat');
const { getProductById } = require('../../../controllers/getProductById');

const Product = require('../../../models/product');

router.get('/cat/:categories', getProductsByCategories);
router.get('/id/:id', getProductById);

router.get('/', async (req, res) => {
    try {
        const products = await Product.find(); // Fetch products from database
        // res.render('viewProducts', { products });
        res.json(products);
    } catch (err) {
        res.status(500).send('Error fetching products: ' + err.message);
    }
});
  

module.exports = router;