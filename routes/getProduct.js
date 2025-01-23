const express = require('express');
const router = express.Router();
const { getProductsByCategories } = require('../controllers/getProdCat');

router.get('/:categories', getProductsByCategories);

module.exports = router;
