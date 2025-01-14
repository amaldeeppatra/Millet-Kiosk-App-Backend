const express = require('express');
const { createProduct } = require('../controllers/createProduct');
const router = express.Router();

router.post('/new', createProduct);

module.exports = router;