const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/auth');
const productRoutes = require('./product/newProduct');
const productsRoutes = require('./product/getProduct');
const searchRoute = require('./search/search');
const orderRoutes = require('./order/order');
const rateProductRoute = require('./product/rateProduct');
const sellerRoutes = require('./seller/manageSeller');
const analyticsRoutes = require('./analytics/dashboard');
const ordersRoute = require('./orders/orders');
const userRoutes = require('./user/user');
const requestRoutes = require('./request/request');
const shopRoutes = require('./shop/shop');
const inventoryRoutes = require('./inventory/inventory');

router.use('/auth', authRoutes);

router.use('/product', productRoutes);

router.use('/products', productsRoutes);

router.use('/search', searchRoute);

router.use('/order', orderRoutes);

router.use('/orders', ordersRoute);

router.use('/rate', rateProductRoute);

router.use('/seller', sellerRoutes);

router.use('/user', userRoutes);

router.use('/analytics', analyticsRoutes);

router.use('/request', requestRoutes);

router.use('/shop', shopRoutes);

router.use('/inventory', inventoryRoutes);

module.exports = router;