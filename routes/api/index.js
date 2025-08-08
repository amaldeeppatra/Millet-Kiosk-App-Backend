const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/auth');
const productRoutes = require('./product/newProduct');
const productsRoutes = require('./product/getProduct');
const searchRoute = require('./search/search');
const orderRoutes = require('./order/order');
const rateProductRoute = require('./product/rateProduct');
const sellerRoutes = require('./seller/manageSeller');

router.use('/auth', authRoutes);

router.use('/product', productRoutes);

router.use('/products', productsRoutes);

router.use('/search', searchRoute);

router.use('/order', orderRoutes);

router.use('/rate', rateProductRoute);

router.use('/seller', sellerRoutes);

module.exports = router;