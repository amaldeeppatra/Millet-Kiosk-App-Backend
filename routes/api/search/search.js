const express = require('express');
const router = express.Router();
const { searchProducts } = require('../../../controllers/searchProduct');

router.get('/', searchProducts);

module.exports = router;