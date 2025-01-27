const express = require('express');
const router = express.Router();
const { getProductsByCategories } = require('../controllers/getProdCat');
const { getProductById } = require('../controllers/getProductById');

router.get('/cat/:categories', getProductsByCategories);
router.get('/id/:id', getProductById);

module.exports = router;
